export class Expression {
    constructor(
        public operator: any,
        public operands: any[] = []
    ) {

    }

    addOperand(operand): void {
        this.operands.push(operand);
    }
}