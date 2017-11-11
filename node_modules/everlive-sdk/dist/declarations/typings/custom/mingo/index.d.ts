declare module 'mingo' {
    interface Mingo {
        Query(filter: any): any;
        Cursor(collection: any, query: any, select?: any): any;
        aggregate(collection: any, pipeline: any): any;
    }


    const mingo: Mingo;
    export default mingo;
}