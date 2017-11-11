app.dataTransformer = {
    //baseUrl: 'http://dixit.tld',
    //baseUrl: 'http://dixit.qabnpparibasfortis.be',
    baseUrl: 'https://dixit.bnpparibasfortis.be',

    relToAbs: function (url) {
        /* Only accept commonly trusted protocols:
         * Only data-image URLs are accepted, Exotic flavours (escaped slash,
         * html-entitied characters) are not supported to keep the function fast */
        if (/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url))
            return url; //Url is already absolute

        if (url.substring(0, 2) == "//")
            return 'https:' + url;
        else if (url.charAt(0) == "/")
            return this.baseUrl + url;
        else if (url.substring(0, 2) == "./")
            url = "." + url;
        else if (/^\s*$/.test(url))
            return ""; //Empty = Return nothing
        else url = "../" + url;

        url = this.baseUrl + '/' + url;
        var i = 0
        while (/\/\.\.\//.test(url = url.replace(/[^\/]+\/+\.\.\//g, "")));

        /* Escape certain characters to prevent XSS */
        url = url.replace(/\.$/, "").replace(/\/\./g, "").replace(/"/g, "%22")
            .replace(/'/g, "%27").replace(/</g, "%3C").replace(/>/g, "%3E");
        return url;
    },

    relativeUrlsToAbsolute: function (html) {
        var _this = this;

        /*HTML/XML Attribute may not be prefixed by these characters (common 
           attribute chars.  This list is not complete, but will be sufficient
           for this function (see http://www.w3.org/TR/REC-xml/#NT-NameChar). */
        var att = "[^-a-z0-9:._]";

        var entityEnd = "(?:;|(?!\\d))";
        var ents = {
            " ": "(?:\\s|&nbsp;?|&#0*32" + entityEnd + "|&#x0*20" + entityEnd + ")",
            "(": "(?:\\(|&#0*40" + entityEnd + "|&#x0*28" + entityEnd + ")",
            ")": "(?:\\)|&#0*41" + entityEnd + "|&#x0*29" + entityEnd + ")",
            ".": "(?:\\.|&#0*46" + entityEnd + "|&#x0*2e" + entityEnd + ")"
        };
        /* Placeholders to filter obfuscations */
        var charMap = {};
        var s = ents[" "] + "*"; //Short-hand for common use
        var any = "(?:[^>\"']*(?:\"[^\"]*\"|'[^']*'))*?[^>]*";
        /* ^ Important: Must be pre- and postfixed by < and >.
         *   This RE should match anything within a tag!  */

        /*
          @name ae
          @description  Converts a given string in a sequence of the original
                          input and the HTML entity
          @param String string  String to convert
          */
        function ae(string) {
            var all_chars_lowercase = string.toLowerCase();
            if (ents[string]) return ents[string];
            var all_chars_uppercase = string.toUpperCase();
            var RE_res = "";
            for (var i = 0; i < string.length; i++) {
                var char_lowercase = all_chars_lowercase.charAt(i);
                if (charMap[char_lowercase]) {
                    RE_res += charMap[char_lowercase];
                    continue;
                }
                var char_uppercase = all_chars_uppercase.charAt(i);
                var RE_sub = [char_lowercase];
                RE_sub.push("&#0*" + char_lowercase.charCodeAt(0) + entityEnd);
                RE_sub.push("&#x0*" + char_lowercase.charCodeAt(0).toString(16) + entityEnd);
                if (char_lowercase != char_uppercase) {
                    /* Note: RE ignorecase flag has already been activated */
                    RE_sub.push("&#0*" + char_uppercase.charCodeAt(0) + entityEnd);
                    RE_sub.push("&#x0*" + char_uppercase.charCodeAt(0).toString(16) + entityEnd);
                }
                RE_sub = "(?:" + RE_sub.join("|") + ")";
                RE_res += (charMap[char_lowercase] = RE_sub);
            }
            return (ents[string] = RE_res);
        }

        /*
          @name by
          @description  2nd argument for replace().
          */
        function by(match, group1, group2, group3) {
            /* Note that this function can also be used to remove links:
             * return group1 + "javascript://" + group3; */
            return group1 + _this.relToAbs(group2) + group3;
        }
        /*
          @name by2
          @description  2nd argument for replace(). Parses relevant HTML entities
          */
        var slashRE = new RegExp(ae("/"), 'g');
        var dotRE = new RegExp(ae("."), 'g');
        function by2(match, group1, group2, group3) {
            /*Note that this function can also be used to remove links:
             * return group1 + "javascript://" + group3; */
            group2 = group2.replace(slashRE, "/").replace(dotRE, ".");
            return group1 + _this.relToAbs(group2) + group3;
        }
        /*
          @name cr
          @description            Selects a HTML element and performs a
                                    search-and-replace on attributes
          @param String selector  HTML substring to match
          @param String attribute RegExp-escaped; HTML element attribute to match
          @param String marker    Optional RegExp-escaped; marks the prefix
          @param String delimiter Optional RegExp escaped; non-quote delimiters
          @param String end       Optional RegExp-escaped; forces the match to end
                                  before an occurence of <end>
         */
        function cr(selector, attribute, marker, delimiter, end) {
            if (typeof selector == "string") selector = new RegExp(selector, "gi");
            attribute = att + attribute;
            marker = typeof marker == "string" ? marker : "\\s*=\\s*";
            delimiter = typeof delimiter == "string" ? delimiter : "";
            end = typeof end == "string" ? "?)(" + end : ")(";
            var re1 = new RegExp('(' + attribute + marker + '")([^"' + delimiter + ']+' + end + ')', 'gi');
            var re2 = new RegExp("(" + attribute + marker + "')([^'" + delimiter + "]+" + end + ")", 'gi');
            var re3 = new RegExp('(' + attribute + marker + ')([^"\'][^\\s>' + delimiter + ']*' + end + ')', 'gi');
            html = html.replace(selector, function (match) {
                return match.replace(re1, by).replace(re2, by).replace(re3, by);
            });
        }
        /* 
          @name cri
          @description            Selects an attribute of a HTML element, and
                                    performs a search-and-replace on certain values
          @param String selector  HTML element to match
          @param String attribute RegExp-escaped; HTML element attribute to match
          @param String front     RegExp-escaped; attribute value, prefix to match
          @param String flags     Optional RegExp flags, default "gi"
          @param String delimiter Optional RegExp-escaped; non-quote delimiters
          @param String end       Optional RegExp-escaped; forces the match to end
                                    before an occurence of <end>
         */
        function cri(selector, attribute, front, flags, delimiter, end) {
            if (typeof selector == "string") selector = new RegExp(selector, "gi");
            attribute = att + attribute;
            flags = typeof flags == "string" ? flags : "gi";
            var re1 = new RegExp('(' + attribute + '\\s*=\\s*")([^"]*)', 'gi');
            var re2 = new RegExp("(" + attribute + "\\s*=\\s*')([^']+)", 'gi');
            var at1 = new RegExp('(' + front + ')([^"]+)(")', flags);
            var at2 = new RegExp("(" + front + ")([^']+)(')", flags);
            if (typeof delimiter == "string") {
                end = typeof end == "string" ? end : "";
                var at3 = new RegExp("(" + front + ")([^\"'][^" + delimiter + "]*" + (end ? "?)(" + end + ")" : ")()"), flags);
                var handleAttr = function (match, g1, g2) { return g1 + g2.replace(at1, by2).replace(at2, by2).replace(at3, by2) };
            } else {
                var handleAttr = function (match, g1, g2) { return g1 + g2.replace(at1, by2).replace(at2, by2) };
            }
            html = html.replace(selector, function (match) {
                return match.replace(re1, handleAttr).replace(re2, handleAttr);
            });
        }

        /* <meta http-equiv=refresh content="  ; url= " > */
        cri("<meta" + any + att + "http-equiv\\s*=\\s*(?:\"" + ae("refresh") + "\"" + any + ">|'" + ae("refresh") + "'" + any + ">|" + ae("refresh") + "(?:" + ae(" ") + any + ">|>))", "content", ae("url") + s + ae("=") + s, "i");

        cr("<" + any + att + "href\\s*=" + any + ">", "href"); /* Linked elements */
        cr("<" + any + att + "src\\s*=" + any + ">", "src"); /* Embedded elements */

        cr("<object" + any + att + "data\\s*=" + any + ">", "data"); /* <object data= > */
        cr("<applet" + any + att + "codebase\\s*=" + any + ">", "codebase"); /* <applet codebase= > */

        /* <param name=movie value= >*/
        cr("<param" + any + att + "name\\s*=\\s*(?:\"" + ae("movie") + "\"" + any + ">|'" + ae("movie") + "'" + any + ">|" + ae("movie") + "(?:" + ae(" ") + any + ">|>))", "value");

        cr(/<style[^>]*>(?:[^"']*(?:"[^"]*"|'[^']*'))*?[^'"]*(?:<\/style|$)/gi, "url", "\\s*\\(\\s*", "", "\\s*\\)"); /* <style> */
        cri("<" + any + att + "style\\s*=" + any + ">", "style", ae("url") + s + ae("(") + s, 0, s + ae(")"), ae(")")); /*< style=" url(...) " > */

        return html;
    },

    categories: function (items) {
        // Insert "Actualit�s" category
        items.splice(app.webservices.newsPosition, 0, {
            CssName: '',
            Id: null,
            Title: app.translations.texts.news,
            AnalyticTitle: window.texts.fr.news
        });

        return items;
    },

    professionCategories: function (items) {
        for (var i = 0; i < items.length; i++) {
            items[i].Index = i;
            items[i].CssName = '';
            if (items[i].Title == 'Functies') {
                items[i].AnalyticTitle = 'Fonctions';
            } else {
                items[i].AnalyticTitle = items[i].Title;
            }
        }

        return items;
    },

    topArticles: function (items) {
        for (var i = 0; i < items.length; i++) {
            items[i] = {
                id: items[i].Id,
                categoryCssClass: (items[i].MainCategory ? items[i].MainCategory.CssName : ''),
                categoryTitle: (items[i].MainCategory ? items[i].MainCategory.Title : ''),
                image: (items[i].TopImage ? items[i].TopImage[0].ThumbnailUrl.AppImage : ''),
                title: items[i].Title,
                header: items[i].Header,
                summary: items[i].Summary,
                date: '',
                vimeoVideoID : items[i].VimeoVideoID,
                youtubeVideoID : items[i].YoutubeVideoID,
                articleType : items[i].Type
            };
        }

        return items;
    },

    articles: function (items) {
        for (var i = 0; i < items.length; i++) {
            items[i] = {
                id: items[i].Id,
                categoryCssClass: (items[i].MainCategory ? items[i].MainCategory.CssName : ''),
                categoryTitle: (items[i].MainCategory ? items[i].MainCategory.Title : ''),
                image: (items[i].TopImage ? items[i].TopImage[0].ThumbnailUrl.AppImage : ''),
                title: items[i].Title,
                header: items[i].Header,
                summary: items[i].Summary,
                date: items[i].PublicationDate,
                vimeoVideoID : items[i].VimeoVideoID,
                youtubeVideoID : items[i].YoutubeVideoID,
                articleType : items[i].Type
            };
        }

        return items;
    },

    article: function (item) {
        var deferred = $.Deferred();
        var _this = this;

        app.storage.getItem('likes', function (likes) {
            if (likes === null) {
                likes = [];
            } else {
                likes = JSON.parse(likes);
            }

            var isLiked = ($.inArray(item.Id, likes) !== -1);

            var gallery = [];
            if (typeof item.Gallery !== 'undefined') {
                for (var i = 0; i < item.Gallery.length; i++) {
                    gallery.push(item.Gallery[i].ThumbnailUrl.AppImage);
                }
            }

            item = {
                id: item.Id,
                categoryCssClass: (item.MainCategory ? item.MainCategory.CssName : ''),
                categoryTitle: (item.MainCategory ? item.MainCategory.Title : ''),
                image: (item.TopImage ? item.TopImage[0].ThumbnailUrl.AppImage : ''),
                title: item.Title,
                analyticTitle: (item.MainCategory ? item.MainCategory.AnalyticTitle + ' : ' : '') + item.AnalyticTitle,
                author: item.ArticleAuthor,
                date: item.PublicationDate,
                header: item.Header,
                quote: item.Quote,
                content: _this.relativeUrlsToAbsolute(item.Content),
                tags: item.Tags,
                hasTags: (item.Tags.length > 0),
                showSurveyAnswers: false,
                survey: (item.Survey ? item.Survey : null),
                showSurvey: false,
                likes: item.Likes,
                url: item.Url,
                isLiked: isLiked,
                gallery: gallery,
                hasGallery: (gallery.length > 0),
                isPrivate: item.Private,
                allowComments : item.AllowComments,
                externalContent : item.ExternalAdditionalContent,
                internalContent : item.InternalAdditionalContent,
                contactEmail : item.ContactEmail ? "mailto:" + item.ContactEmail : "",
                vimeoVideoID : item.VimeoVideoID,
                youtubeVideoID : item.YoutubeVideoID,
                articleType : item.Type
            };
            if (item.survey) {
                for (var i = 1; i <= 5; i++) {
                    if (typeof item.survey['Answer' + i] !== 'undefined') {
                        item.survey['FormattedCount' + i] = item.survey['CountAnswer' + i] + ' (' + Math.round(item.survey['PercentageAnswer' + i]) + '%)'
                    }
                }
            }

            if (item.survey !== null) {
                app.storage.getItem('surveys', function (surveys) {
                    if (surveys === null) {
                        surveys = [];
                    } else {
                        surveys = JSON.parse(surveys);
                    }

                    item.showSurveyAnswers = ($.inArray(item.survey.Id, surveys) === -1);
                    item.showSurvey = !item.showSurveyAnswers;

                    deferred.resolve(item);
                });
            } else {
                deferred.resolve(item);
            }
        });

        return deferred;
    },

    comments: function (items) {
        var that = this;
        for (var i = 0; i < items.length; i++) {
            var replies = items[i].Replies;
            items[i] = {
                id: items[i].Id,
                createdDate: that.parseJsonDate(items[i].CreatedDate),
                articleId: items[i].ArticleId,
                authorName: items[i].AuthorName,
                authorMail: items[i].AuthorMail,
                message: items[i].Message,
                validate: items[i].Validate,
                highlighted: items[i].Highlighted,
                replies: []
            };
            for (var j = 0; j < replies.length; j++) {
                items[i].replies[j] = {
                    id: replies[j].Id,
                    createdDate: that.parseJsonDate(replies[j].CreatedDate),
                    articleId: replies[j].ArticleId,
                    authorName: replies[j].AuthorName,
                    authorMail: replies[j].AuthorMail,
                    message: replies[j].Message,
                    validate: replies[j].Validate,
                    highlighted: replies[j].Highlighted
                };
            }
        }
        return items;
    },
    parseJsonDate: function (jsonDateString) {
        var date = new Date(parseInt(jsonDateString.replace('/Date(', '')));
        return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    },

    relatedArticles: function (items) {
        for (var i = 0; i < items.length; i++) {
            items[i] = {
                id: items[i].Id,
                categoryCssClass: (items[i].MainCategory ? items[i].MainCategory.CssName : ''),
                categoryTitle: (items[i].MainCategory ? items[i].MainCategory.Title : ''),
                image: (items[i].TopImage ? items[i].TopImage[0].ThumbnailUrl.AppImage : ''),
                title: items[i].Title
            };
        }

        return items;
    },

    events: function (items) {
        for (var i = 0; i < items.length; i++) {
            items[i] = {
                id: items[i].Id,
                image: (items[i].EventImageUrl ? items[i].EventImageUrl.Url : ''),
                title: items[i].Title,
                startDate: items[i].StartDate,
                startDay: items[i].StartDay,
                startDayMonth: items[i].StartDayMonth,
                startYear: items[i].StartYear,
                endDate: items[i].EndDate,
                endDay: items[i].EndDay,
                endDayMonth: items[i].EndDayMonth,
                endYear: items[i].EndYear,
                location: $.trim(items[i].Location.Street + ' ' + items[i].Location.City + ' ' + items[i].Location.State + ' ' + items[i].Location.Country),
                url: items[i].Url,
                title: items[i].Title,
                analyticTitle: items[i].StartYear + '/' + (moment(items[i].StartDate).month() + 1) + ' : ' + items[i].AnalyticTitle,
                summary: items[i].Summary,
                content: items[i].Content
            };
        }

        return items;
    },

    event: function (item) {
        var startDate = moment(item.startDate);
        var endDate = moment(item.endDate);

        if (startDate.hour() + startDate.minutes() == 0) {
            item.startTime = startDate.format('hh:mm');
        } else {
            item.startTime = '';
        }

        item.isSameDay = startDate.isSame(endDate, 'day');

        return item;
    }
};
