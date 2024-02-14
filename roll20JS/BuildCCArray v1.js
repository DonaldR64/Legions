
    const BuildCCArray = (id) => {
        let startTime = Date.now();

        let initialModel = ModelArray[id];
        let attacker = initialModel.player;
        let defender = (attacker === 0) ? 1:0;
    
        let unmatchedIDs = DeepCopy(UnitArray[initialModel.unitID].modelIDs);
        let unitIDs = [initialModel.unitID];
        let attackerIDs = [];
        let subsetIDs = []; //those in B2B contact with building
        let defenderIDs = [];
        let garrisonIDs = []; //those defending a structure
        let hexModelIDs = {};
        do {
            let id = unmatchedIDs.shift();
            let model = ModelArray[id];
            let garrison = (model.garrison === "") ? false:true;
            let surroundingHexes = SurroundingHexes(id,garrison);
            _.each(surroundingHexes,hex => {
                let nids = [];
                if (hexMap[hex.label()].structureID !== "") {
                    if (subsetIDs.includes(id) === false && model.player === attacker) {
                        subsetIDs.push(id);
                    }
                    let gids = Garrisons(hexMap[hex.label()].structureID,"Query");
                    for (let i=0;i<gids.length;i++) {
                        let gunit = UnitArray[gids[i]];
                        if (gunit) {
                            _.each(gunit.modelIDs,mid => {
                                if (garrisonIDs.includes(mid) === false) {
                                    garrisonIDs.push(mid);
                                }
                            })
                        }
                    }
                } else {
                    nids = hexMap[hex.label()].modelIDs;
                }
                hexModelIDs[hex.label()] = nids;
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
                                if (garrisonIDs.includes(id2) === false) {defenderIDs.push(id2)};
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
                                if (garrisonIDs.includes(id) === false) {defenderIDs.push(id)};
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
    

if (garrisonIDs.length > 0) {
    SetupCard("Garrisons","","Neutral")
    outputCard.body.push("Garrison Force")
    _.each(garrisonIDs,id => {
        outputCard.body.push(ModelArray[id].name);
    })
    outputCard.body.push("[hr]");
    outputCard.body.push("Attackers");
    _.each(subsetIDs,id => {
        outputCard.body.push(ModelArray[id].name);
    })
    PrintCard();
}



        let defenderInfo = {};
        let attackerInfo = {};

        let CCArray = [];
        let GGArray = [];

        //- Count up # of attackers attacking structure
        //Divide the garrison up evenly - can just loop through
        //if more attackers than defenders, will adjust at end if they remain unengaged
        for (let i=0;i<subsetIDs.length;i++) {
            let group = {
                attackerIDs: [subsetIDs[i]],
                defenderIDs: [],
            }
            GGArray.push(group);
        }        

        let pos = 0;
        for (let i=0;i<garrisonIDs.length;i++) {
            GGArray[pos].defenderIDs.push(garrisonIDs[i]);
            pos++;
            if (pos > (GGArray.length - 1)) {pos = 0};
        }

        //Then go onto other non-garrison troops involved in combat

        for (let i=0;i<attackerIDs.length;i++) {
            let id1 = attackerIDs[i];
            let model1 = ModelArray[id1];
            let group = CCArray.find(group => {
                return group.attackerIDs.includes(id1);
            })
            if (!group) {
                group = {
                    attackerIDs: [id1],
                    defenderIDs: [],
                };
            }

            for (let j=0;j<defenderIDs.length;j++) {
                let id2 = defenderIDs[j];
                let model2 = ModelArray[id2];
                let dist = ModelDistance(model1,model2).distance;
                if (dist < 1) {
                    group.defenderIDs.push(id2);
                    if (!attackerInfo[id1]) {
                        attackerInfo[id1] = [id2];
                    } else {
                        attackerInfo[id1].push(id2);
                    }
                    if (!defenderInfo[id2]) {
                        defenderInfo[id2] = [id1];
                    } else {
                        defenderInfo[id2].push(id1);
                    }
                }
            }
            CCArray.push(group);
        }
        CCArray.sort((a,b) => {
            return (a.defenderIDs.length - b.defenderIDs.length);
        })
        let dRatio = Math.max(1,Math.floor((defenderIDs.length + garrisonIDs.length)/attackerIDs.length));

        SetupCard("Pre Sort","",initialModel.faction);
        for (let i=0;i<CCArray.length;i++) {
            let group = CCArray[i];
            if (i > 0) {
                outputCard.body.push("[hr]");
            }
            outputCard.body.push("Group " + (i+1));
            _.each(group.attackerIDs,id => {
                outputCard.body.push(ModelArray[id].name);
            })
            _.each(group.defenderIDs,id => {
                outputCard.body.push(ModelArray[id].name);
            })
        }
        outputCard.body.push("[hr]");
        let keys = Object.keys(defenderInfo);
        for (let i=0;i<keys.length;i++) {
            let line = ModelArray[keys[i]].name + ": " + defenderInfo[keys[i]].length;
            outputCard.body.push(line);
        }
        outputCard.body.push("[hr]");
        keys = Object.keys(attackerInfo);
        for (let i=0;i<keys.length;i++) {
            let line = ModelArray[keys[i]].name + ": " + attackerInfo[keys[i]].length;
            outputCard.body.push(line);
        }
        PrintCard();

        let CCArray2 = [];
        let assignedDefenders = [];
        let assignedAttackers = [];
log("Attackers")
        //Part 1 - run through attackerInfo, those with just dRatio (usually 1) opponent are 'fixed' and moved to 2nd array
        let pass = 0;
        let change = false;
        do {
            pass++
            log("Pass: " + pass)
            change = false;
            let akeys = Object.keys(attackerInfo);
            for (let i=0;i<akeys.length;i++) {
                if (attackerInfo[akeys[i]].length === 1) {
                    log(ModelArray[akeys[i]].name + " has only 1 opponent")
                    let group = CCArray.find(group => {
                        return group.attackerIDs.includes(akeys[i]);
                    })
                    let index = CCArray.findIndex(group => {return group.attackerIDs.includes(akeys[i])});
                    if (group) {
                        assignedAttackers.push(akeys[i]);
                        let id2 = group.defenderIDs[0]; //as only 1
                        if (id2) {
                            for (let w=0;w<CCArray.length;w++) {
                                let group2 = CCArray[w];
                                let index3 = group2.defenderIDs.indexOf(id2);
                                if (index3 > -1) {
                                    CCArray[w].defenderIDs.splice(index3,1);
                                }
                            }
                            _.each(akeys, id4 => {
                                let index4 = attackerInfo[id4].indexOf(id2);
                                if (index4 > -1) {
                                    attackerInfo[id4].splice(index4,1);
                                }
                            })
                            defenderInfo[id2] = [];
                            if (assignedDefenders.includes(id2) === false) {
                                assignedDefenders.push(id2);
                                log(ModelArray[id2].name + " assigned")
                            }
                            newGroup = {
                                attackerIDs: [akeys[i]],
                                defenderIDs: [id2],
                            }
                            CCArray2.push(newGroup);
                        }
                        attackerInfo[akeys[i]] = [];
                        CCArray.splice(index,1);
                        change = true;
                    }
                }
            }
        } while (change === true);
log("Defenders")
        //PArt 2 - run through defenderInfo, those with just 1 are 'fixed' and moved to 2nd array
        pass = 0;
        change = false;
        do {
            pass++
            log("Pass: " + pass)
            change = false;
            let dkeys = Object.keys(defenderInfo);
            for (let i=0;i<dkeys.length;i++) {
                if (defenderInfo[dkeys[i]].length === 1) {
                    log(ModelArray[dkeys[i]].name + " has only 1 opponent")
                    let group = CCArray.find(group => {
                        return group.defenderIDs.includes(dkeys[i]);
                    })
                    let index = CCArray.findIndex(group => {return group.defenderIDs.includes(dkeys[i])});
log(group)
                    if (group) {
                        let aid = group.attackerIDs[0];
                        let otherDefenders = group.defenderIDs.filter(id => {
                            return id !== dkeys[i];
                        })
                        for (let d=0;d<otherDefenders.length;d++) {
                            let index4 = defenderInfo[otherDefenders[d]].indexOf(aid);
                            if (index4 > -1) {
                                defenderInfo[otherDefenders[d]].splice(index4,1);
                            }
                        }
                        group.defenderIDs = [dkeys[i]];
                        CCArray2.push(group);
                        CCArray.splice(index,1);
                        assignedDefenders.push(dkeys[i]);
                        attackerInfo[aid] = [];
                        assignedAttackers.push(aid);
                        defenderInfo[dkeys[i]] = [];
                        change = true;
                    } 
                }
            }
        } while (change === true);

        //run through attackers to see if any not assigned
        //assign to neighbouring defender
log("Attackers")
        _.each(attackerIDs,aid => {
            if (assignedAttackers.includes(aid) === false) {
                let model = ModelArray[aid];
log("Missing is " + model.name)
                let bestChoiceID;
                let highestRank = 0;
                let lowestCAF = 20;
                let lowestOpponents = 1000;
                let surroundingHexes = SurroundingHexes(aid,false);
                shloop1:
                for (let h=0;h<surroundingHexes.length;h++) {   
                    let hex = surroundingHexes[h];
                    let nids = hexModelIDs[hex.label()];
                    for (let n=0;n<nids.length;n++) {
                        let id2 = nids[n];
                        let model2 = ModelArray[id2];
                        if (model2.player !== model.player) {
log(model2.name + ":" + id2)
                            if (assignedDefenders.includes(id2) === false) {
log("Unassigned Defender")
                                assignedDefenders.push(id2);
                                bestChoiceID = id2;
                                break shloop1;
                            } else {
                                if (!bestChoiceID) {bestChoiceID = id2};
                                for (let i=0;i<CCArray2.length;i++) {
                                    let group = CCArray2[i];
    log(group)
                                    if (group.defenderIDs.includes(id2)) {
                                        let opps = group.defenderIDs.length;
                                        log(i + ": " + opps)
                                        if (opps < lowestOpponents) {
                                            lowestOpponents = opps;
                                            bestChoiceID = id2;
                                            highestRank = model2.rank;
                                            lowestCAF = model2.caf;
                                        } else if (model2.rank > highestRank) {
                                            lowestOpponents = opps;
                                            bestChoiceID = id2;
                                            highestRank = model2.rank;
                                            lowestCAF = model2.caf;
                                        } else if (model2.caf < lowestCAF) {
                                            lowestOpponents = opps;
                                            bestChoiceID = id2;
                                            highestRank = model2.rank;
                                            lowestCAF = model2.caf;
                                        }
                                    }
                                }
                            }
                        }
                    };
                };

log(bestChoiceID)
                let group = CCArray2.find(group => {
                    return group.defenderIDs.includes(bestChoiceID);
                })
                if (group) {
                    group.attackerIDs.push(aid);
                } else {
log("New Group")
                    let newgroup = {
                        attackerIDs: [aid],
                        defenderIDs: [bestChoiceID],
                    }
                    CCArray2.push(newgroup);
                }
            }
        })
        log("Defenders")

        //run through defenders to see if any not assigned
        //assign to neighbouring attacker
        _.each(defenderIDs,did => {
            if (assignedDefenders.includes(did) === false) {
                let model = ModelArray[did];
log("Missing is " + model.name)
                let bestChoiceID;
                let lowestRank = 5;
                let highestCAF = 0;
                let lowestOwn = 1000;
                let surroundingHexes = SurroundingHexes(did,true);
                _.each(surroundingHexes,hex => {
                    let nids = hexModelIDs[hex.label()];
                    _.each(nids,id2 => {
                        let model2 = ModelArray[id2];
                        if (model2.player === attacker) {
                            if (!bestChoiceID) {bestChoiceID = id2};
log(model2.name + ":" + id2)
                            for (let i=0;i<CCArray2.length;i++) {
                                let group = CCArray2[i];
log(group)

                                if (group.attackerIDs.includes(id2)) {
                                    let opps = group.defenderIDs.length;
                                    if (opps < lowestOwn) {
                                        lowestOwn = opps;
                                        bestChoiceID = id2;
                                        lowestRank = model2.rank;
                                        highestCAF = model2.caf;
                                    } else if (model2.rank < lowestRank) {
                                        lowestOwn = opps;
                                        bestChoiceID = id2;
                                        lowestRank = model2.rank;
                                        highestCAF = model2.caf;
                                    } else if (model2.caf > highestCAF) {
                                        lowestOwn = opps;
                                        bestChoiceID = id2;
                                        lowestRank = model2.rank;
                                        highestCAF = model2.caf;
                                    }
                                }
                            }
                        }
                    });
                });

                log(bestChoiceID)
                let group = CCArray2.find(group => {
                    return group.attackerIDs.includes(bestChoiceID);
                })
                if (group) {
                    group.defenderIDs.push(did);
                } else {
                    let newgroup = {
                        attackerIDs: [bestChoiceID],
                        defenderIDs: [did],
                    }
                    CCArray2.push(newgroup)
                }
            }
        });
log("CCArray2")
log(CCArray2)
log("GGArray")
log(GGArray)


        let flag = CCArray2.length;

        if (GGArray.length > 0) {
            let unattachedAttackers = [];
            let GGArray2 = [];
            for (let i=0;i<GGArray.length;i++) {
                let group = GGArray[i];
                let attID = group.attackerIDs[0];
                let defIDs = group.defenderIDs;
                if (defIDs.length === 0) {
                    unattachedAttackers.push(attID);
                } else {
                    GGArray2.push(group);
                }
            }
            let pos = 0;
            if (unattachedAttackers.length > 0) {
                for (let i=0;i<unattachedAttackers.length;i++) {
                    GGArray2[pos].attackerIDs.push(unattachedAttackers[i]);
                    pos++;
                    if (pos > (GGArray2.length -1)) {pos = 0};
                }
            }
            for (let i=0;i<GGArray2.length;i++) {
                let group = GGArray2[i];
                let attID = group.attackerIDs[0];
                let defIDs = group.defenderIDs;
                if (flag > 0) {
                    let group = CCArray2.find(group => {
                        return group.attackerIDs.includes(attID);
                    })
                    if (group) {
                        for (let j=0;j<defIDs.length;j++) {
                            group.defenderIDs.push(defIDs[j]);
                        }
                    } else {
                        CCArray2.push(group);
                    }
                } else {
                    CCArray2.push(group)
                }
            }
        }

        SetupCard("Post Sort 2","",initialModel.faction);
        for (let i=0;i<CCArray2.length;i++) {
            let group = CCArray2[i];
            if (i > 0) {
                outputCard.body.push("[hr]");
            }
            outputCard.body.push("Group " + (i+1));
            _.each(group.attackerIDs,id => {
                outputCard.body.push(ModelArray[id].name);
            })
            _.each(group.defenderIDs,id => {
                outputCard.body.push(ModelArray[id].name);
            })
        }
    
        PrintCard();
    
        let elapsed = Date.now()-startTime;
        log("Sorted in " + elapsed/1000 + " seconds");

//going to want to return more than the CCArray, likely garrisonIDs and subsetIDs
        return CCArray2;
    }
    