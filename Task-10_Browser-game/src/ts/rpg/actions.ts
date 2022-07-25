export function getExpForStateLevelUp(state: RPG.TState): number {
    return (state.value + 1) * state.expMultiplier;
}

export function addStateExp(state: RPG.TState, exp: number) {
    state.experience += exp;
    const nextLevelExp = getExpForStateLevelUp(state);
    if (state.experience >= nextLevelExp) {
        state.value++;
        state.experience = 0;
    }
}

export function getDamageByStrength(strength: number): TDiceExpression {
    const baseStrength = 10;
    const modToDice = 4;
    const result = { count: 1, dice: { min: 1, max: 6 }, mod: 0 };
    const strengthMod = strength - baseStrength;
    if (strengthMod < 0) {
        result.mod = -Math.round(-strengthMod / 2);
    } else {
        result.mod = strengthMod % modToDice;
        result.count = ((strengthMod - result.mod) / modToDice) + 1;
        if (result.mod > (modToDice / 2)) {
            result.count += 1;
            result.mod -= modToDice;
        }
    }
    return result;
}