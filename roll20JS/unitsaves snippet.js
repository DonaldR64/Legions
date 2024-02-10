const UnitSaves = (unit,targetIDArray,hitArray,note) => {
    let targetUnitStartingModels = unit.modelIDs.length;
//amend for knights/titans
    if (!note) {note = " "};
    //organize targetIDArray based on rank then wounds then distance from unit's 'centre' 
    //so hits will go to: if multiple wounds, any wounded are picked off first, then lowest ranks first, then farthest from centre
    //Precise hits will do opposite    
    if (targetIDArray.length > 1) {
        let centreTargetModel = CentreUnit(unit);
        targetIDArray.sort(function (a,b) {
            let aM = ModelArray[a];
            let bM = ModelArray[b];
            let aW = parseInt(aM.token.get("bar1_value"));
            let bW = parseInt(bM.token.get("bar1_value"));
            if (aW < bW) {return 1};
            if (aW > bW) {return -1};
            if (aM.rank < bM.rank) {return -1};
            if (aM.rank > bM.rank) {return 1};
            let aD = ModelDistance(aM,centreTargetModel).distance;
            let bD = ModelDistance(bM,centreTargetModel).distance;
            return (bD - aD);
        })
    }
    //sort hits by AP 
    // highest first so that higher weapons kill lesser bases or are taken on void shields
    hitArray.sort(function(a,b) {
        let aAP = parseInt(a.weapon.ap);
        let bAP = parseInt(b.weapon.ap);
        return bAP - aAP;
    });
    //now run through each hit and apply
    let kills = 0;
    let quakeFlag = false;

    //hitarray run as do/while loop to allow adding hits from deflagrate
    let hal = hitArray.length;
    let h = -1;
    do {
        let hit = hitArray.shift();
log(hit)
        let shooter = ModelArray[hit.shooterID];
        let arc = Arc(target,shooter); //arc that shooter is in
        let weapon = hit.weapon;
        let ap = hit.weapon.ap;

        target = ModelArray[targetIDArray[0]];
        if (note === "Individual") {
            h++;
            target = ModelArray[targetIDArray[h]];
        }
        if (target) {
            if (weapon.traits.includes("Precise")) {
                target = ModelArray[targetIDArray[targetIDArray.length - 1]];
            }
            let distance = ModelDistance(shooter,target);
            let wounds = parseInt(target.token.get("bar1_value")) || 1;
            //apply hits to voidshields first
            let voidShields = parseInt(target.token.get("bar2_value")) || 0;
            if (SearchSpecials(weapon.traits,bypassVoid) === true) {
                //if has trait in bypassVoid list, bypasses the Void Shields, or if rolled 6 on collapsing singularity roll
                voidShields = 0;
            }
            if (voidShields > 0) {
                let num = 1;
                if (weapon.traits.includes("Shock Pulse")) {num = 2};
                num = Math.min(voidShields,num);
                let s = (num === 1) ? "":"s";
                let line = "[#ff0000]Hit takes down " + num + " Void Shield" + s;
                voidShields -= num;
                target.token.set("bar2_value",voidShields);
                if (voidShields === 0) {
                    line += "causing the Shields to collapse!";
                }
                outputCard.body.push(line + "[/#]");
            }
            //if void shields still intact, should go to next hit
            //else go to saves
            if (voidShields === 0) {
                if (weapon.traits.includes("Quake")) {
                    quakeFlag = true;
                }
                needed = target.save;
                let saveTips = "<br>Armour Save: " + needed + "+";
                let armourFlag = true;
                if (SearchSpecials(weapon.traits,["Light"]) === true && target.special.includes("Armoured")) {
                    ap = 0;
                    saveTips += "<br>Light is Ap 0 vs Armoured";
                }
                if (weapon.traits.includes("Anti-Tank") ||weapon.traits.includes("Anti-tank") && (target.type === "Infantry" || target.type === "Cavalry")) {
                    ap = 0;
                    saveTips += "<br>AP is 0 vs " + target.type;
                }
                if (ap < 0) {
                    saveTips += "<br>AP " + ap;
                    needed -= ap;
                }
                if ((arc === "Rear" && target.scale > 1) || weapon.traits.includes("Burrowing")) {
                    saveTips += "<br>Rear Arc -1";
                    needed += 1;
                }

                //alternative saves - have to check and pick best 
                let altSaveTips = "";
                let altSave = 7;
                //cover
                if (SearchSpecials(weapon.traits,bypassCover) === false) {
                    let coverSave = hexMap[target.hexLabel].coverSave;
                    if (coverSave < 7 && target.special.includes("Scout")) {
                        coverSave = Math.max(2,coverSave - 1);
                    }
                    if (coverSave < 7 && coverSave < needed) {
                        altSaveTips += "<br>Cover Save Used: " + coverSave + "+";
                        altSave = coverSave;
                    }
                }

                //ion shields
                if (SearchSpecials(weapon.traits,bypassIon) === false && arc === "Front") {
                    let ionSave = target.ionShields;
                    if (ionSave < 7) {
                        let ionSave = target.ionShields;
                        if (ap === -2 || ap === -3) {
                            ionSave++;
                        }
                        if (ap > -3) {
                            ionSave+=2;
                        }
                        if ((weapon.traits.includes("Barrage") || weapon.traits.includes("Blast")) && target.special.includes("Ionic Flare Shield")) {
                            ionSave -= 1;
                        }
                        if (ionSave < needed && ionSave < altSave) {
                            altSaveTips = "<br>Ion Shield Used: " + ionSave + "+";
                            altSave = ionSave;
                        }
                    }
                }
                //Jink Save
                if (SearchSpecials(weapon.traits,bypassJink) === false && targetUnit.order !== "First Fire") {
                    let jinkSave = target.jinkSave;
                    if (jinkSave < 7) {
                        if (jinkSave < needed && jinkSave < altSave) {
                            altSaveTips = "<br>Jink Save: " + jinkSave + "+";
                            altSave = jinkSave;
                        }
                    }
                }
                //Invulnerable
                if (SearchSpecials(weapon.traits,bypassInvulnerable) === false) {
                    let invulSave = target.invulSave;
                    if ((weapon.traits.includes("Barrage") || weapon.traits.includes("Blast")) && target.special.includes("Explorator Adaptation")) {
                        invulSave = Math.min(invulSave,6);
                    }
                    if (distance > 6) {
                        let sg = Aura(target,"Shield Generator",6);
                        if (sg > 0) {
                            invulSave = sg;
                        }
                    }
                    if (invulSave < 7) {
                        if (invulSave < needed && invulSave < altSave) {
                            altSaveTips = "<br>Invul Save: " + invulSave + "+";
                            altSave = invulSave;
                        }
                    }
                }
                if (altSave < needed) {
                    needed = altSave;
                    saveTips += altSaveTips;
                    armourFlag = false;
                }
                let saveRoll = randomInteger(6);
                let tip = "Roll: " + saveRoll + " vs " + needed + "+";
                let rerollNeeded = false;
                if (armourFlag === true) {
                    if (weapon.traits.includes("Shred") && (target.type === "Infantry" || target.type === "Cavalry") && saveRoll >= needed) {
                        rerollNeeded = "Shred";
                    }
                    if (weapon.traits.includes("Armourbane") && target.scale > 1 && saveRoll >= needed) {
                        rerollNeeded = "Armourbane";
                    }
                    if (SearchSpecials(weapon.traits,["Light"]) === true && target.special.includes("Armoured") && saveRoll < needed) {
                        rerollNeeded = "Armoured vs Light Weapon"
                    } 
                    if (weapon.traits.includes("Neutron-flux") && target.special.includes("Cybernetica") && saveRoll >= needed) {
                        rerollNeeded = "Neutron-flux vs Cybernetica Cortex";
                        //counts as Shred or Armourbane basically
                    }
                }

                if (rerollNeeded !== false) {
                    saveRoll = randomInteger(6);
                    tip += "Reroll due to " + rerollNeeded + ": " + saveRoll;
                }
                tip += saveTips;
                tip = '[🎲](#" class="showtip" title="' + tip + ')';

                if (saveRoll < needed) {
                    let damage = 1;
                    if (Aura(target,"Medicae",4) === true || target.special.includes("Feel No Pain") && SearchSpecials(weapon.traits,["Light"]) === true) {
                        let roll3 = randomInteger(6);
                        tip += "<br>Medicae/Feel No Pain: " + roll3 + " vs. 5+";
                        if (roll3 > 4) {
                            outputCard.body.push(tip + " " + target.name + " - ignores the Wound");
                            damage = 0;
                        }
                    }
                    if (Aura(target,"Battlesmith",3) === true  && weapon.ap < -1) {
                        let roll3 = randomInteger(6);
                        tip += "<br>Battlesmith: " + roll3 + " vs. 5+";
                        if (roll3 > 4) {
                            outputCard.body.push(tip + " " + target.name + " - ignores the Wound");
                            damage = 0;
                        }
                    }
                    if (damage > 0) {
                        if (weapon.traits.includes("Engine Killer")) {
                            let extra = getX(weapon.traits,"Engine Killer");
                            outputCard.body.push("Engine Killer causes " + extra + " extra Damage");
                            damage += extra;
                        }
                        wounds -= damage;
                        target.token.set("bar1_value",wounds);
                        if (wounds > 0) {
                            outputCard.body.push(tip + " [#FF0000]" + target.name + " takes " + damage + " Damage from " + weapon.name + "[/#]");
                            if (weapon.traits.includes("Shock Pulse")) {
                                target.token.set(SM.shocked,true);
                                outputCard.body.push("The Target's movement is halved, and if it hasn't fired this round can only fire one weapon");
                            }
                        } else {
                            kills++;
                            if (target.type === "Infantry" || target.type === "Cavalry") {
                                outputCard.body.push(tip + " [#FF0000]" + target.name + " is Killed by " + weapon.name + "[/#]");
                            } else {
                                outputCard.body.push(tip + " [#FF0000]" + target.name + " is Destroyed by " + weapon.name + "[/#]");
                            }
                            //kill routine and remove from target array
                        }

                        if (weapon.traits.includes("Deflagrate")) {
                            let deflagrateRoll = randomInteger(6);
                            let tip = "Deflagrate Roll: " + deflagrateRoll + " vs. " + hit.needed + "+"; 
                            tip = '[🎲](#" class="showtip" title="' + tip + ')';
                            if (deflagrateRoll >= hit.needed) {
                                defWeapon = DeepCopy(weapon);
                                defWeapon.traits = defWeapon.traits.replace("Deflagrate","");
                                defWeapon.name = "Deflagrate Hit";
                                let defhitInfo = {
                                    shooterID: shooterID,
                                    weapon: defWeapon,
                                    roll: deflagrateRoll,
                                    needed: needed,
                                    notes: hitNotes,
                                }                                
                                hitArray.push(defhitInfo);
                                hal++;
                                outputCard.body.push(tip + "[#FF0000]Deflagrate hits[/#]");
                            } else {
                                outputCard.body.push(tip + " Deflagrate does not hit")
                            }
                        }
                    }
                } else {
                    outputCard.body.push(tip + " " + target.name + " - Saves vs " + weapon.name);
                }
            }
        } else {
            outputCard.body.push("[hr]");
            outputCard.body.push("Entire Target Detachment Destroyed!");
            hitArray = [];
            //consepences here
        }
        hal--;
    } while (hal > 0);




    if (kills > Math.round(targetUnitStartingModels/2) && targetUnit.modelIDs.length > 0) {
        outputCard.body.push("Morale Check");


    }

    if (quakeFlag === true && unit.modelIDs.length > 0) {
        outputCard.body.push("The Detachment's movement is affected by Quake");
        outputCard.body.push("Its movement is halved, and it has -1 to hit");
        outputCard.body.push("These effects last to the end of the round");
        _.each(unit.modelIDs,id => {
            let model = ModelArray[id];
            model.token.set(SM.quake,true);
        }) 
    } 

    PrintCard();






    
}