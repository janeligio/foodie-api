export function randomIndex(range): number {
    return Math.floor(Math.random() * Math.floor(range));
}

export function randomizeBusinesses(businesses) {
    let randomized = [];
    let orderedBusinesses = [...businesses];
    while(orderedBusinesses.length > 0) {
        const oblen = orderedBusinesses.length;
        const rand = randomIndex(oblen);
        if(rand === oblen-1) {
            randomized.push(orderedBusinesses.pop())
        } else {
            const temp = orderedBusinesses[rand];
            randomized.push(temp);
            orderedBusinesses[rand] = orderedBusinesses[oblen-1];
            orderedBusinesses.pop();
        }
    }
    return randomized;
}

export function isUndefined(value: any): boolean {
    return typeof value === 'undefined';
}