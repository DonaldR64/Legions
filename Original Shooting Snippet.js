


    const Shooting = (msg) => {
        let Tag = msg.content.split(";");
        let shooterID = Tag[1];
        let targetID = Tag[2];
        let ignoreCover = (Tag[3] === "Yes") ? true:false;
        let numbers = Tag[4] || 1; //weapon numbers
        //let onlyVisible = (Tag[5] === "No") ? false:true;//place a query in weapon macro, with "Target Only Visible Models|No|Yes"
        let onlyVisible = false;

        let bypassVoid = ["Burrowing","Bypass","Impale","Psi","Warp"];
        let bypassInvulnerable = ["Psi","Warp"];
        let bypassIon = ["Psi","Warp"];
        let bypassCover = ["Psi","Warp","Firestorm","Ignores Cover"];
        let bypassJink = ["placeholder"];
        let antiStructure = ["Bombing Run","Bunker Buster","Demolisher","Heavy Barrage","Heavy Beam","Wrecker"]

        let shooter = ModelArray[shooterID];
        let target = ModelArray[targetID];
        let shooterUnit = UnitArray[shooter.unitID];

        let targetUnits = []; //array of units hit, usually one unit, but may be more for barrage, blast, beam and similar
       
        SetupCard(shooterUnit.name,"Hits",shooterUnit.faction);
        //check Unit hasnt already fired
        let shooterLeader = ModelArray[shooterUnit.modelIDs[0]];
        if (shooterLeader.token.get("aura1_color") === Colours.black) {
            outputCard.body.push("Unit has already Activated/Fired");
            PrintCard();
            return;
        }

        if (target.type === "System Unit") {
            let type = target.token.get("gmnotes").toString();
            if (type.includes("Blast")) {
                let radius = type.replace.replace(/\D/g,'');
                let scatter;
                if (radius === 5) {
                    scatter = (randomInteger(6) + 1) * 80;
                } else {
                    scatter = (randomInteger(3) + 1) * 80;
                }
                let scatterRoll = randomInteger(3);
                if (scatterRoll > 1) {
                    //scatters
                    let centre = hexMap[target.hexLabel].centre;
                    outputCard.body.push("Blast Scatters");
                    let theta = randomInteger(360) * Math.PI / 180;
                    let newCentre = new Point(( Math.cos(theta) * scatter + centre.x),(Math.sin(theta) * scatter + centre.y));
                    let newHex = pointToHex(newCentre);
                    newCentre = hexMap[newHex.label()];
                    target.token.set({
                        left: newCentre.x,
                        top: newCentre.y,
                    });
                    target.hex = newHex;
                    target.location = newCentre;
                    target.hexLabel = newHex.label();
                }
 





            } else if (type.includes("Beam")) {






            } 
            //firestorm?



        } else {
            if (shooterUnit.hasBarrage === true && (target.type === "Infantry" && hexMap[target.hexLabel].structureID !== "")) {
                //each unit garrisoning a building takes hits
                let unitIDs = Garrisons(hexMap[target.hexLabel].structureID);
                _.each(unitIDs,unitID => {
                    let info = {
                        unitID: unitID,
                        hitArray: [],
                        startingModels: UnitArray[unitID].modelIDs.length,
                    }   
                    targetUnits.push(info);
                })
            } else {
                let info = {
                    unitID: target.unitID,
                    hitArray: [],
                    startingModels: UnitArray[target.unitID].modelIDs.length,
                }   
                targetUnits.push(info);
            }
        }



////////////////////








        //go through shooter unit and see who has range/los to at least 1 target, make their their eligible target list
        //add target ids also to an array
    
        let shooterIDArray = [];
        let targetIDArray = [];
        let toHitMod = 0;
        let toHitTip = "";
        let shooterExceptions = [];

        for (let s=0;s<shooterUnit.modelIDs.length;s++) {
            shooter = ModelArray[shooterUnit.modelIDs[s]];
            let eta = []; //targets
            let ewa = []; //weapons with range/arc
            let closestDist = Infinity;
            let losFlag = false;
            let coverFlag = false;
            let rangeFlag = false;
            let arcFlag = false;
            let losPenalty = 0;

            for (let t=0;t<targetUnit.modelIDs.length;t++) {
                target = ModelArray[targetUnit.modelIDs[t]];
                if (target.token.get(SM.pinned) === true) {
                    pinFlag = true;
                    continue;
                }; 
                let special = " ";
                if (shooter.hasIndirect === true) {
                    special = "Indirect"
                }
                let losResult = LOS(shooter.id,target.id,special);
            
                if (losResult.los === false) {
                    if (shooter.hasIndirect === true && onlyVisible === false) {
                        //has an indirect capable weapon && is targeting all
                        if (AugerArray(shooter,target) === false) {
                            losPenalty = 1;
                        }
                    } else {
                        //no los or has indirect but only targetting visible
                        losFlag = true;
                        continue;
                    }
                }



                if (ignoreCover === true && losResult.toHitMod < 0) {
                    coverFlag = true;
                    continue;
                };
                closestDist = Math.min(closestDist,losResult.distance);

                if (losResult.toHitMod < toHitMod) {
                    toHitMod = losResult.toHitMod;
                    toHitTip = losResult.toHitTip;
                }

                //check for engaged friendly, if pinned already screened out
                //additional -1 unless friendly is much smaller
                if (target.token.get(SM.engaged) === true) {
                    for (let i=0;i<target.engagedIDs.length;i++) {
                        let engaged = ModelArray[target.engagedIDs[i]];
                        if (parseInt(target.scale) - parseInt(engaged.scale) < 2) {
                            toHitMod -= 1;
                            toHitTip += "<br>Targeting Engaged Enemy"
                            break;
                        }
                    }
                }
                

                let weaponNumbers = [];
    
                for (let w=0;w<shooter.weaponArray.length;w++) {
                    if (shooter.token.get(SM.shocked) === true && w > 0) {
                        continue;
                    }
                    let weapon = DeepCopy(shooter.weaponArray[w]);
    log(weapon)
                    if (shooter.token.get(SM.moved) === false && weapon.traits.includes("Siege Weapon") === true) {
                        weapon.maxRange *= 2;
                    }

                    if (losResult.distance > weapon.maxRange || losResult.distance < weapon.minRange) {
                        rangeFlag = true;
                        continue;
                    };
                    if (losResult.los === false && weapon.traits.includes("Barrage") === false) {
                        continue;
                    }

                    if ((weapon.arc === "Front" && losResult.arc !== "Front") || (weapon.arc === "Rear" && losResult.arc !== "Rear")) {
                        arcFlag = true;
                        continue;
                    };


                    weaponNumbers.push(w);
                    ewa.push(w);
                }
                if (weaponNumbers.length > 0) {
                    let etaInfo = {
                        targetID: target.id,
                        losResult: losResult,
                    }
                    eta.push(etaInfo);
                    targetIDArray.push(target.id);
                };
            }
            ewa = [...new Set(ewa)];
            shooter.eta = eta;
            shooter.closestDist = closestDist;
            shooter.ewa = ewa;
            shooter.losPenalty = losPenalty;
            if (eta.length > 0) {
                shooterIDArray.push(shooter.id);
            } else {
                let exception = [];
                if (losFlag === true) {exception.push(" No LOS")};
                if (coverFlag === true) {exception.push(" Targets In Cover")};
                if (rangeFlag === true) {exception.push(" Targets Out of Range")};
                if (arcFlag === true) {exception.push(" Targets Out of Arc")};
                exception = "<br>" + shooter.name + ":" + exception.toString();
                shooterExceptions.push(exception);
            }
        }
    
        if (shooterIDArray.length === 0) {
            let line = shooterExceptions.toString();
            line = '[😡](#" class="showtip" title="Shooters without Targets' + line + ')';
            outputCard.body.push(line + " No Shooters Have Targets");
            PrintCard();
            return;
        }

        targetIDArray = [...new Set(targetIDArray)];
        //organize targetarray based on rank then wounds then distance from unit's 'centre' 
        //so hits will go to lowest ranks first, then if multiple wounds, any wounded are picked off first, then farthest from centre
        //Precise hits will do opposite

        let avgArmour;

        if (targetIDArray.length > 1) {
            let centreTargetModel = CentreUnit(targetUnit);
            targetIDArray.sort(function (a,b) {
                let aM = ModelArray[a];
                let bM = ModelArray[b];
                if (aM.rank < bM.rank) {return -1};
                if (aM.rank > bM.rank) {return 1};
                let aW = parseInt(aM.token.get("bar1_value"));
                let bW = parseInt(bM.token.get("bar1_value"));
                if (aW < bW) {return 1};
                if (aW > bW) {return -1};
                let aD = ModelDistance(aM,centreTargetModel).distance;
                let bD = ModelDistance(bM,centreTargetModel).distance;
                return (bD - aD);
            })
        }

        let hitArray = [];


        for (let s=0;s<shooterIDArray.length;s++) {
            let shooter = ModelArray[shooterIDArray[s]];
log(shooter.name)
log(shooter.ewa)
            for (let i=0;i<shooter.ewa.length;i++) {
                let weapon = shooter.weaponArray[shooter.ewa[i]];
log(weapon.name)
                let wthtip = toHitTip;
                let wth = parseInt(toHitMod);
                let toHit = parseInt(weapon.toHit);
                let csFlag = false;
                if (weapon.traits.includes("Collapsing Singularity")) {
                    let csRoll = randomInteger(6);
                    if (csRoll === 1) {
                        let hp = parseInt(shooter.token.get("bar1_value")) || 1;
                        if (hp === 1) {
                            outputCard.body.push("[#ff0000]" + shooter.name + " creates a Collapsing Singularity upon itself. It is Destroyed![/#]");
///kill the shooter
                            continue;
                        } else {
                            outputCard.body.push("[#ff0000]" + shooter.name + " creates a Collapsing Singularity upon itself and takes 1 Damage[/#]");
                            shooter.token.set("bar1_value",(hp - 1));
                        }
                    } else if (csRoll === 6) {
                        csFlag = true;
                        outputCard.body.push("[#ff0000]" + shooter.name + " creates a Collapsing Singularity upon the target![/#]");
                        wthtip += "Collapsing Singularity!<br>Shields bypassed, Invulnerable Saves bypassed!";
                    }
                }

                if (weapon.traits.includes("Graviton")) {
                    if (avgArmour === undefined) {
                        if (targetUnit.type === "Structure") {
            //moved to buildinghits
                            avgArmour = 3;
                            wth = 0;
                        } else {
                            _.each(targetIDArray,id => {
                                avgArmour += parseInt(ModelArray[id].save) || 6;
                            });
                            avgArmour = Math.floor(avgArmour/targetIDArray.length);
                        }
                    }
                    toHit = avgArmour;
                    wthtip = "Graviton: " + toHit + "+<br>" + wthtip;
                }

                let extraTips = "";

                let attacks = weapon.dice;
                if (weapon.traits.includes("Assault") && shooter.closestDist <= (weapon.maxRange/2)) {
                    attacks *= 2;
                    if (extraTips.includes("Assault") === false) {
                        extraTips += "<br>Assault";
                    }
                }
                if (weapon.traits.includes("Warp")) {
                    attacks = 0;
                    if (targetUnit.type === "Knight" || targetUnit.type === "Titan") {
                        _.each(targetIDArray,id => {
                            attacks += parseInt(ModelArray[id].token.get("bar1_value"));
                        })
                    } else {
                        attacks = targetIDArray.length;
                    }
                }

                if (weapon.traits.includes("Barrage")) {
                    if (isGarrisoned === true) {
                        attacks = Math.round(attacks/2);
                    }
                    extraTips += "<br>Barrage";
                    if (shooter.losPenalty !== 0) {
                        wthtip += "<br>Indirect Fire -1";
                        wth += 1;
                    }
                }


                if (weapon.traits.includes("Power Capacitor") && shooterUnit.order === "First Fire") {
                    attacks *= 2;
                    if (extraTips.includes("Power Capacitor") === false) {
                        extraTips += "<br>Power Capacitor";
                    }
                }


                if (weapon.traits.includes("Ignores Cover")) {
                    if (wthtip.includes("Terrain -1")) {
                        wthtip.replace("Terrain -1","Ignores Cover");
                        wth += 1;
                    }
                    if (wthtip.includes("In Structure -2")) {
                        wthtip.replace("In Structure -2","Ignores Cover");
                        wth += 2;
                    }
                }

                if (shooter.token.get(SM.quake) === true) {
                    wthtip += "<br>Quake -1";
                    wth += 1;
                }


                let hits = 0;
                let rolls = [];
                let needed = toHit + wth;
                needed = Math.min(6,Math.max(2,needed)); 
                //1 is auto miss, 6 = auto hit

                if (targetUnit.flyers === true && weapon.traits.includes("Skyfire") === false && shooter.special.includes("Tracking Array") === false) {
                    wthtip = "<br>Targetting Flyers";
                    needed = 6;
                }

                if (targetUnit.flyers === true) {
                    if (weapon.traits.includes("Skyfire") || (shooter.special.includes("Tracking Array") && shooterUnit.order === "First Fire")) {
                        wthtip = "<br>Skyfire vs Flyers";
                    } else {
                        wthtip = "<br>Targetting Flyers without Skyfire";
                        needed = 6;
                    }
                }

                for (let j=0;j<attacks;j++) {
                    let roll = randomInteger(6);
                    rollText = roll.toString();
                    let roll2;
                    let voidShields = parseInt(target.token.get("bar2_value")) || 0;

                    if (weapon.traits.includes("Accurate") && roll < needed) {
                        roll2 = randomInteger(6);
                        roll = Math.max(roll,roll2); --- > should be just roll2
                        if (extraTips.includes("Accurate") === false) {
                            extraTips += "<br>Accurate";
                        }
                    } 
                    if (shooter.special.includes("Macro-Extinction") && targetUnit.scale > 2 && roll < needed) {
                        roll2 = randomInteger(6);
                        roll = Math.max(roll,roll2);
                        if (extraTips.includes("Macro-Extinction") === false) {
                            extraTips += "<br>Macro-Extinction";
                        }
                    }

                    if (weapon.traits.includes("Ripple Fire") && roll === 1 && shooterUnit.order === "First Fire") {
                        roll2 = randomInteger(6);
                        roll = Math.max(roll,roll2);
                        if (extraTips.includes("Ripple Fire") === false) {
                            extraTips += "<br>Ripple Fire";
                        }
                    }
                    if (weapon.traits.includes("Tracking") && targetUnit.flyers === true && roll < needed) {
                        roll2 = randomInteger(6);
                        roll = Math.max(roll,roll2);
                        if (extraTips.includes("Tracking") === false) {
                            extraTips += "<br>Tracking";
                        }
                    }
                    
                    if (roll2) {
                        rollText = rollText + "/" + roll2;
                    }

                    if (SearchSpecials(weapon.traits,["Light"]) === true && target.scale > 1) {
                        roll = 0;
                        rollText = 0;
                        extraTips = "<br>Light Weapon's Fire pings off the Target'";
                    }

                    if (voidShields > 0 && SearchSpecials(weapon.traits,bypassVoid) === false && weapon.traits.includes("Shieldbane") === false && ( weapon.ap === 0 || weapon.traits.includes("Light AT")) ) {
                        roll = 0;
                        rollText = 0;
                        extraTips += "<br>Weapon's Fire Pings off Void Shields";
                    }

                    if (targetUnit.type === "Structure" && SearchSpecials(weapon.traits,antiStructure) === false) {
                        roll = 0;
                        rollText = 0;
                        extraTips += "<br>Weapon's Fire takes some chunks out of the Building but is unable to Damage";
                    }



                    rolls.push(rollText);

                    if (roll >= needed) {
                        hitNotes = "";
                        if (csFlag === true) {
                            hitNotes += "CS";
                        }

                        if (weapon.traits.includes("Rapid Fire") && roll === 6) {
                            if (extraTips.includes("Rapid Fire") === false) {
                                extraTips += "<br>Rapid Fire";
                            }
                            hits++;
                            let hitInfo = {
                                shooterID: shooterID,
                                weapon: weapon,
                                roll: roll,
                                needed: needed,
                                notes: hitNotes,
                            }
                            hitArray.push(hitInfo);
                            rolls.push(7);
                        }

                        hits++;
                        let hitInfo = {
                            shooterID: shooterID,
                            weapon: weapon,
                            roll: roll,
                            needed: needed,
                            notes: hitNotes,
                        }
                        hitArray.push(hitInfo);
                    }
                }
                rolls.sort();
                rolls.reverse();
                let tip = "Rolls: " + rolls.toString() + " vs " + needed + "+";
                tip += toHitTip + wthtip + extraTips;
                tip = '[🎲](#" class="showtip" title="' + tip + ')';
                if (hits === 0) {
                    line = tip + " " + shooter.name + " misses";
                } else {
                    let s = (hits > 1) ? "s":"";
                    line = tip + " [#FF0000]" + shooter.name + " gets " + hits + " hit" + s + " with " + weapon.name + "[/#]";
                }

                outputCard.body.push(line);

            }
            


        }

        let s = (hitArray.length > 1 || hitArray.length === 0) ? "s":"";
        outputCard.body.push("[hr]");
        outputCard.body.push(hitArray.length + " hit" + s + " total");
        PrintCard();

        if (hitArray.length === 0) {
            return;
        }

        //sort hits by AP 
        // highest first so that higher weapons kill lesser bases or are taken on void shields
        hitArray.sort(function(a,b) {
            let aAP = parseInt(a.weapon.ap);
            let bAP = parseInt(b.weapon.ap);
            return bAP - aAP;
        });

        //now run through each hit and apply
 log(hitArray)

        SetupCard(targetUnit.name,"Saves",targetUnit.faction);
        let kills = 0;
        let quakeFlag = false;
        let hal = hitArray.length;
log("HAL: " + hal)
        do {
            let hit = hitArray.shift();
log(hit)
            let shooter = ModelArray[hit.shooterID];
            let arc = Arc(target,shooter); //arc that shooter is in
            let weapon = hit.weapon;

            let ap = hit.weapon.ap;

            target = ModelArray[targetIDArray[0]];
            if (target) {
                if (weapon.traits.includes("Precise") || weapon.traits.includes("Impale")) {
                    target = ModelArray[targetIDArray[targetIDArray.length - 1]];
                }
            
                if (hit.weapon.traits.includes("Impale")) {
                    let sRoll = randomInteger(6);
                    let tRoll = randomInteger(6)
                    let sW = parseInt(shooter.token.get("bar1_value")) || 1;
                    let sWMod = Math.min(2,Math.round((sW-2)/2));
                    let tW = parseInt(target.token.get("bar1_value")) || 1;
                    let tWMod = Math.min(2,Math.round((tW-2)/2));
                    sRes = sRoll + shooter.scale + sWMod;
                    tRes = tRoll + target.scale + tWMod;
                    let damage = Math.max(sRes - tRes,0);
                    tip += "Net Result of " + damage + " Damage"
                    tip += "<br>Shooter Total: " + sRes;
                    tip += "<br>Target Total: " + tRes;
                    tip += "<br>Shooter Roll: " + sRoll + " + Scale: " + shooter.scale + " + " + sWMod + " for Wounds";
                    tip += "<br>Target Roll: " + tRoll + " + Scale: " + target.scale + " + " + tWMod + " for Wounds";
                    tip = '[🎲](#" class="showtip" title="' + tip + ')';
                    tW -= damage;
                    target.token.set("bar1_value",tW);

                    if (damage > 0) {
                        if (tW > 0) {
                            outputCard.body.push(tip + " " + target.name + " takes " + damage + " Damage from Impale");
                        } else {
                            kills++;
                            if (target.type === "Infantry" || target.type === "Cavalry") {
                                outputCard.body.push(tip + " " + target.name + " is Killed by Impale");
                            } else {
                                outputCard.body.push(tip + " " + target.name + " is Destroyed by Impale");
                            }
                        }
                    } else {
                        outputCard.push(tip + " " + target.name + " takes no damage from the Impale");
                    }
                } else {
                    let distance = ModelDistance(shooter,target);

                    let wounds = parseInt(target.token.get("bar1_value")) || 1;

                    //apply hits to voidshields first
                    let voidShields = parseInt(target.token.get("bar2_value")) || 0;
                    if (SearchSpecials(weapon.traits,bypassVoid) === true || hit.notes.includes("CS") === true) {
                        voidShields = 0;
                    }



                    if (voidShields > 0) {
                        //if has trait in bypassVoid list, bypasses the Void Shields, or if rolled 6 on collapsing singularity roll
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
                        if (weapon.traits.includes("Bunker Buster") && target.type === "Structure") {
                            ap *= 2;
                            saveTips += "<br>AP doubled due to Bunker Buster";
                        }
    
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
                        if (SearchSpecials(weapon.traits,bypassIon) === false && arc === "Front" && hit.notes.includes("CS") === false) {
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
                        if (SearchSpecials(weapon.traits,bypassInvulnerable) === false && hit.notes.includes("CS") === false) {
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
    
                        let alive = true;

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
                                if (weapon.traits.includes("Graviton") && target.type === "Structure") {
                                    damage = randomInteger(3) + 1;
                                    outputCard.body.push("Graviton Pulse causes " + damage + " Damage");
                                }
    
                                if (wounds === 1) {
                                    kills++;
                                    alive = false;
                                    if (target.type === "Infantry" || target.type === "Cavalry") {
                                        outputCard.body.push(tip + " [#FF0000]" + target.name + " is Killed by " + weapon.name + "[/#]");
                                    } else {
                                        outputCard.body.push(tip + " [#FF0000]" + target.name + " is Destroyed by " + weapon.name + "[/#]");
                                    }
                                    //kill routine and remove from target array
                                } else if (wounds > 1) {
                                    
                                    wounds -= damage;
                                    target.token.set("bar1_value",wounds);
    
                                    if (wounds > 0) {
                                        outputCard.body.push(tip + " [#FF0000]" + target.name + " takes " + damage + " Damage from " + weapon.name + "[/#]");
                                    } else {
                                        alive = false;
                                        kills++;
                                        if (target.type === "Infantry" || target.type === "Cavalry") {
                                            outputCard.body.push(tip + " [#FF0000]" + target.name + " is Killed by " + weapon.name + "[/#]");
                                        } else {
                                            outputCard.body.push(tip + " [#FF0000]" + target.name + " is Destroyed by " + weapon.name + "[/#]");
                                        }
                                        //kill routine and remove from target array
                                    }
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
                         
                                        log("Added Hit")
                                        log(defhitInfo)
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

                        if (alive === true) {
                            if (weapon.traits.includes("Shock Pulse")) {
                                target.token.set(SM.shocked,true);
                                outputCard.body.push("The Target's movement is halved, and if it hasn't fired this round can only fire its Main weapon");
                            }

                        }



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

        if (quakeFlag === true && targetUnit.modelIDs.length > 0) {
            outputCard.body.push("The Detachment's movement is affect by Quake");
            outputCard.body.push("Its movement is halved, and it has -1 to hit");
            outputCard.body.push("These effects last to the end of the round");
            _.each(targetUnit.modelIDs,id => {
                let model = ModelArray[id];
                model.token.set(SM.quake,true);
            }) 
        } 


    
    
    
    
    
        PrintCard();

    }
