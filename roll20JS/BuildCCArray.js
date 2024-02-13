const BuildCCArray = (id) => {
    let initialModel = ModelArray[id];
    let attacker = initialModel.player;
    let defender = (attacker === 0) ? 1:0;

    let unmatchedIDs = UnitArray[initialModel.unitID].modelIDs;
    let unitIDs = [initialModel.unitID];
    let attackerIDs = [];
    let defenderIDs = [];

    do {
        let id = unmatchedIDs.shift();
        let model = ModelArray[id];
        _.each(model.hex.neighbours(),hex => {
            let nids = hexMap[hex.label()].modelIDs;
            if (nids.length > 0) {
                _.each(nids,id2 => {
                    let model2 = ModelArray[id2];
                    if (model.player === attacker && model2.player === defender) {
                        if (attackerIDs.includes(id) === false) {
                            attackerIDs.push(id);
                            if (unitIDs.includes(model.unitID) === false) {
                                unitIDs.push(model.unitID);
                                unmatchedIDs = unmatchedIDs.concat(UnitArray[model.unitID].modelIDs);
                            }
                        }
                        if (defenderIDs.includes(id2) === false) {
                            defenderIDs.push(id2);
                            if (unitIDs.includes(model2.unitID) === false) {
                                unitIDs.push(model2.unitID);
                                unmatchedIDs = unmatchedIDs.concat(UnitArray[model2.unitID].modelIDs);
                            }
                        }
                    } else if (model.player === defender && model2.player === attacker) {
                        if (attackerIDs.includes(id2) === false) {
                            attackerIDs.push(id2);
                            if (unitIDs.includes(model2.unitID) === false) {
                                unitIDs.push(model2.unitID);
                                unmatchedIDs = unmatchedIDs.concat(UnitArray[model2.unitID].modelIDs);
                            }
                        }
                        if (defenderIDs.includes(id) === false) {
                            defenderIDs.push(id);
                            if (unitIDs.includes(model.unitID) === false) {
                                unitIDs.push(model.unitID);
                                unmatchedIDs = unmatchedIDs.concat(UnitArray[model.unitID].modelIDs);
                            }
                        }
                    }
                });
            }
        });
    } while (unmatchedIDs.length > 0);


    SetupCard("Close Combat","","Neutral")
    outputCard.body.push("Attackers")
    _.each(attackerIDs,id => {
        outputCard.body.push(ModelArray[id].name);
    })
    outputCard.body.push("Defenders")
    _.each(defenderIDs,id => {
        outputCard.body.push(ModelArray[id].name);
    })
    PrintCard();

    let CCArray = [];

    for (let i=0;i<attackerIDs.length;i++) {
        let id1 = attackerIDs[i];
        let model1 = ModelArray[id1];
        let group = {
            attackerIDs: [id1],
            defenderIDs: [],
        };
        for (let j=0;j<defenderIDs.length;j++) {
            let id2 = defenderIDs[i];
            let model2 = ModelArray[id2];
            let dist = ModelDistance(model1,model2).distance;
            if (dist < 1) {
                group.defenderIDs.push(id2);
            }
        }
        CCArray.push(group);
    }

    









    
    










}