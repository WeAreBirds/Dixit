declare module 'bs-aggregation-translator' {
    interface Translator {
        translate(query: any, {
            maxDocumentsCount: number
        }): any;
    }

    const aggregationTranslator: Translator;
    export default aggregationTranslator;
}