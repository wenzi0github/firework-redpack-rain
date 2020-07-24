export const sum = (a: number, b: number): number => {
    return a + b;
};

export const subtraction = (a: number, b: number): number => {
    return a - b;
};

export const random = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};
