const CloseCombat = (msg) => {
    let modelID = msg.selected[0].id;
    let p1Model = ModelArray[modelID];
    SetupCard("Close Combat","",p1Model.faction);
    let p1Unit = UnitArray[p1Model.unitID];

    let attacker = p1Model.player;
    let defender = (attacker === 0) ? 1:0;

    let CCArray = []; //sets of combatants

    let unmatchedIDs = [p1Unit.modelIDs];

    let cc = unmatchedIDs.length;

    do {
        let id = unmatchedIDs.shift();
        let model = ModelArray[id];
        let neighbours = model.hex.neighbours(); //surrounding hexes
        _.each(neighbours,hex => {
            let opponents = [[],[]];
            let modelIDs = hexMap[hex.label()].modelIDs;
            _.each(modelIDs,id2 => {
                let model2 = ModelArray[id2];
                let m2Flag = false;
                if (model2.player !== model.player) {
                    for (let i=0;i<CCArray.length;i++) {
                        if (CCArray[i][model.player].includes(id) && CCArray[i][model2.player].includes(id2) === false) {
                            CCArray[i][model2.player].push(id2);
                            m2Flag = true;
                            break;
                        } else if (CCArray[i][model2.player].includes(id2) && CCArray[i][model.player].includes(id) === false) {
                            CCArray[i][model.player].push(id);
                            m2Flag = true;
                            break;
                        }
                    }
                    if (m2Flag === false) {
                        opponents[model.player].push(id);
                        opponents[model2.player].push(id);
                        CCArray.push(opponents);
                    }
                    unmatchedIDs.push(id2); //so its neighbours get checked
                    cc++;
                }
            });
        });
        cc--;
    } while (cc > 0);


    if (CCArray.length === 0) {
        outputCard.body.push("No Valid Close Combats Found");
        PrintCard();
        return;
    }



    log(CCArray);






































}