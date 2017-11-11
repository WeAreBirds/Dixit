export declare class Expression {
    operator: any;
    operands: any[];
    constructor(operator: any, operands?: any[]);
    addOperand(operand: any): void;
}
