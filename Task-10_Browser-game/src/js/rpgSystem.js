import { getRandomInt } from "./utils";

/* DICES */

export function getDiceExpressionValue(expression) {
    let result = expression.mod || 0;
    let values = [];

    for (let i = 0; i < expression.count; i++) {
        let value = getRandomInt(expression.dice.min, expression.dice.max);
        result += value;
        values.push(value);
    }

    return { result, values, mod: expression.mod };
}

export function getMainDiceValue() {
    return getDiceExpressionValue({ count: 3, dice: { min: -3, max: 3 }, mod: 0 });
}

/* STATES */

export const States = {
    strength: 'CHAR-STATE-STR',
    dexterity: 'CHAR-STATE-DEX',
    intelligence: 'CHAR-STATE-INT',
    constitution: 'CHAR-STATE-CON',
};

export function getStatesTemplate() {
    const statesDefValue = 10;
    const statesDefExpMult = 1;
    const statesDefExp = 0;

    function getDefValues() {
        return { value: statesDefValue, expMultiplier: statesDefExpMult, experience: statesDefExp };
    }

    let states = {
        [States.strength]: getDefValues(States.strength), // damage, weight
        [States.dexterity]: getDefValues(States.dexterity), // melee attack, dodge
        [States.intelligence]: getDefValues(States.intelligence), // magick
        [States.constitution]: getDefValues(States.constitution), // hp
    };

    return states;
}

export function expForLevelUpForState(state) {
    return (state.value + 1) * state.expMultiplier;
}

export function addStateExp(state, exp) {
    let nextLevelExp = expForLevelUpForState(state);
    state.experience += exp;
    if (state.experience >= nextLevelExp) {
        state.value++;
        state.experience = 0;
    }
}

/* ARMOR */

export const ArmorParts = {
    head: 'ITEM-EQUIP-ARMOR-PART-HEAD',
    body: 'ITEM-EQUIP-ARMOR-PART-BODY',
    hands: 'ITEM-EQUIP-ARMOR-PART-HANDS',
    legs: 'ITEM-EQUIP-ARMOR-PART-LEGS',
}

export const ArmorPartDefence = {
    [ArmorParts.head]: (lvl) => lvl - Math.ceil(lvl / 3),
    [ArmorParts.body]: (lvl) => lvl + Math.ceil(lvl / 3) + 1,
    [ArmorParts.hands]: (lvl) => lvl,
    [ArmorParts.legs]: (lvl) => lvl,
};

/* WEAPON */

export function WeaponBaseDamage(level) {
    return level + 1;
}

/* COMMON */

export function getDamageByStrength(strength) {
    const baseStrength = 10;
    const modToDice = 4;
    let result = { count: 1, dice: { min: 1, max: 6 }, mod: 0 };
    let delta = strength - baseStrength;
    if (delta < 0) {
        result.mod = Math.sign(delta) * Math.round(Math.abs(delta) / 2);
    } else {
        result.mod = delta;
        while (result.mod > 2) {
            result.count += 1;
            result.mod -= modToDice;
        }
    }
    return result;
}

export function getHealthByArmor(stateValue, armorPart, armorLevel) {
    let armor = ArmorPartDefence[armorPart](armorLevel);
    return stateValue * armor;
}

export function getShieldByArmor(stateValue, armorPart, armorLevel) {
    let armor = ArmorPartDefence[armorPart](armorLevel);
    return armor;
}