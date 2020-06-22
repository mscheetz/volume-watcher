export class Arbitrage{
    id: string;
    exchange: string;
    previous: string;
    value: number;
    orderBookValue: number;
    pair: string;
    price: number;
    unit: string;
    continue: boolean;
    final: number;
    possible: boolean;
    bestPrice: string;
}