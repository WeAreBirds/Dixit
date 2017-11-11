import { HtmlHelper } from "./htmlHelper";
export declare class HtmlHelperResponsiveModule {
    htmlHelper: HtmlHelper;
    constructor(htmlHelper: HtmlHelper);
    getBackgroundWidth(el: any): number;
    getBackgroundHeight(el: any): number;
    parseParamsString(str: any): {
        params: {};
        isUserResize: boolean;
    };
    getImgParams(src: any, el: any): {
        imgUrl: any;
        operations: any;
        isUserResize: any;
    };
    hasClass(el: any, cl: any): boolean;
    getImageWidth(el: any): number;
    getImageHeight(el: any): number;
    getDevicePixelRatio(): number;
    getPixelRatio(el: any): number | boolean;
    getImgParamsString(params: any): string;
    responsiveImage(item: any, dataSrc: any): Promise<{}>;
    getImgSrc(image: any, imgWidth: any): any;
}
