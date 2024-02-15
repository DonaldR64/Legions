const BuildCCArray = (id) => {
    let initialModel = ModelArray[id];
    let attacker = initialModel.player; //maybe determined higher in script during initiative??
    let initialUnit = UnitArray[initialModel.unitID];

    let unmatchedIDs = [];
    _.each(initialUnit.modelIDs,id => {
        unmatchedIDs.push(id);
    })

    let defendingGarrisonIDs = [];
    let attackingGarrisonIDs = [];
    let unitIDs = [];//units involved in the Combat
    let attackerIDs = [];
    let defenderIDs = [];
    let attackerInfo = {};
    let defenderInfo = {};

    //build arrays of all combatants in this combat
    do {
        let id = unmatchedIDs.shift();
        let model = ModelArray[id];
        let garrison = (model.garrison === "") ? false:true;
        let surroundingHexes = SurroundingHexes(id,garrison);
        _.each(surroundingHexes,hex => {
            let nids = [];
            if (hexMap[hex.label()].structureID !== "") {


            } else {
                nids = hexMap[hex.label()].modelIDs;
            }
            hexModelIDs[hex.label()] = nids;
            if (nids.length > 0) {
                _.each(nids,id2 => {
                    let model2 = ModelArray[id2];
                    if (model.player === attacker && model2.player !== attacker) {
                        let info = {hexLabel: hex.label(),defenderID: id2}
                        if (!attackerInfo[id]) {
                            attackerInfo[id] = [info];
                        } else {
                            attackerInfo[id].push(info);
                        }
                        if (attackerIDs.includes(id) === false) {
                            attackerIDs.push(id);
                            if (unitIDs.includes(model.unitID) === false) {
                                unitIDs.push(model.unitID);
                                _.each(UnitArray[model.unitID].modelIDs,id => {
                                    unmatchedIDs.push(id);
                                })
                            }
                        }
                        if (defenderIDs.includes(id2) === false) {
                            if (unitIDs.includes(model2.unitID) === false) {
                                unitIDs.push(model2.unitID);
                                _.each(UnitArray[model2.unitID].modelIDs,id => {
                                    unmatchedIDs.push(id);
                                })
                            }
                        }
                    } else if (model.player !== attacker && model2.player === attacker) {
                        let info =  {hexLabel: hex.label(),attackerID: id2}
                        if (!defenderInfo[id]) {
                            defenderInfo[id] = [info];
                        } else {
                            defenderInfo[id].push(info);
                        }
                        if (attackerIDs.includes(id2) === false) {
                            attackerIDs.push(id2);
                            if (unitIDs.includes(model2.unitID) === false) {
                                unitIDs.push(model.unitID);
                                _.each(UnitArray[model2.unitID].modelIDs,id => {
                                    unmatchedIDs.push(id);
                                })
                            }
                        }
                        if (defenderIDs.includes(id) === false) {
                            if (unitIDs.includes(model.unitID) === false) {
                                unitIDs.push(model.unitID);
                                _.each(UnitArray[model.unitID].modelIDs,id => {
                                    unmatchedIDs.push(id);
                                })
                            }
                        }
                    }
                });
            }
        });
    } while (unmatchedIDs.length > 0);

    let CCArray = [];

log("Unit IDs")
log(unitIDs)
log("Attacker IDs")
log(attackerIDs)
log("Defender IDs")
log(defenderIDs)
log("Attacker Info")
log(attackerInfo)
log("Defender Info")
log(defenderInfo)



    const PairOne = (id) => {
        




    }


























}