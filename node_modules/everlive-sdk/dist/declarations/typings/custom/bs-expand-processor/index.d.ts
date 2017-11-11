declare module 'bs-expand-processor' {
    interface Processor_Instances {
        prepare(expand: any, collectionName: any, isArray: any, fields: any, arg1: any, arg2: any, callback: any);
        expand(tree: any, result: any, opts: any, callback: any);
    }

    interface Processor_Static {
        new (executionNodeFunction: any): Processor_Instances
    }

    const Processor: Processor_Static;
    export default Processor;
}