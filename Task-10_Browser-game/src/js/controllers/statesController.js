import { createTextControllerByHtml, ButtonsConfig } from "./textController";
import { HTMLTags } from "../render";
import * as rpg from "../rpgSystem";
import { getTranslation, languages } from "../translations/translation";

export function createStatesController(character, stateDetails = false) {
    function getStateRow(stateName) {
        let state = character.states[stateName];
        let result = {
            tag: HTMLTags.TableRow,
            childs: [
                {
                    tag: HTMLTags.TableData,
                    value: getTranslation(languages.ru, stateName)
                },
                {
                    tag: HTMLTags.TableData,
                    value: state.value
                },
            ]
        };
        if (stateDetails) {
            result.childs.push({
                tag: HTMLTags.TableData,
                value: `${state.experience}/${rpg.expForLevelUpForState(state)}`
            });
        }
        return result;
    }

    function getArmorRow(part) {
        return {
            tag: HTMLTags.TableRow,
            childs: [
                {
                    tag: HTMLTags.TableData,
                    value: getTranslation(languages.ru, part)
                },
                {
                    tag: HTMLTags.TableData,
                    value: character.armor[part]
                }
            ]
        };
    }

    function getWeaponRow() {
        return {
            tag: HTMLTags.TableRow,
            childs: [
                {
                    tag: HTMLTags.TableData,
                    value: 'Оружие'
                },
                {
                    tag: HTMLTags.TableData,
                    value: character.weapon
                }
            ]
        };
    }

    let content = {
        tag: HTMLTags.Table,
        attributes: { class: 'width_100 align_center' },
        childs: [
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        value: 'Имя'
                    },
                    {
                        tag: HTMLTags.TableData,
                        value: character.name
                    }
                ]
            },
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        value: 'Характеристики'
                    },
                    {
                        tag: HTMLTags.TableData,
                        value: 'Экипировка'
                    }
                ]
            },
            {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        childs: [
                            {
                                tag: HTMLTags.Table,
                                attributes: { class: 'width_100 align_center' },
                                childs: [
                                    getStateRow(rpg.States.strength),
                                    getStateRow(rpg.States.dexterity),
                                    getStateRow(rpg.States.intelligence),
                                    getStateRow(rpg.States.constitution),
                                ]
                            }
                        ]
                    },
                    {
                        tag: HTMLTags.TableData,
                        childs: [
                            {
                                tag: HTMLTags.Table,
                                attributes: { class: 'width_100 align_center' },
                                childs: [
                                    getArmorRow(rpg.ArmorParts.head),
                                    getArmorRow(rpg.ArmorParts.body),
                                    getArmorRow(rpg.ArmorParts.hands),
                                    getArmorRow(rpg.ArmorParts.legs),
                                    getWeaponRow()
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
    return createTextControllerByHtml([content], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;
}