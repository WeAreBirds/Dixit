declare module 'jstimezonedetect' {
    interface jstzStatic {
        determine(): any;
        date_is_dst(): boolean;
        dst_start_for(): Date;
    }

    export const jstz: jstzStatic;
}