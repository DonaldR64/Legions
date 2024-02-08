//make a deep copy of weapon to feed into this, add or change anything like adding singularity

const WeaponHits = (weapon,shooter,modelIDs,attacks,indirect) => {
    let shooterUnit = UnitArray[shooter.unitID];
    let testTarget = ModelArray[modelIDs[0]];
    let baseToHit = parseInt(weapon.toHit);
    if (!indirect) {indirect = false};
    let hitTips = "Base: " + baseToHit + "+";
    let toHitMod = 0;
    let hitArray = [];
    let avgArmour = 0;
    _.each(modelIDs,id => {
        avgArmour += parseInt(ModelArray[id].save) || 6;
        let hex = hexMap[ModelArray[id].hexLabel];
        if (weapon.traits.includes("Ignores Cover") === false) {
            if (hex.hitLevel === 4) {
                toHitMod = Math.max(2,toHitMod);
            } else if (hex.hitLevel === 3) {
                toHitMod = Math.max(1,toHitMod);
            } else if (hex.hitLevel === 2 && ModelArray[id].scale < 5) {
                toHitMod = Math.max(1,toHitMod);
            } else if (hex.hitLevel === 1 && ModelArray[id].scale < 3) {
                toHitMod = Math.max(1,toHitMod);
            }
        }
    });
    avgArmour = Math.floor(avgArmour/modelIDs.length);
    if (weapon.traits.includes("Graviton")) {
        baseToHit = avgArmour;
        hitTips = "Graviton: " + baseToHit +"+";
    }

    if (toHitMod === 1) {
        hitTips = "<br>Terrain -1";
    } else if (toHitMod === 2) {
        hitTips = "<br>Structure -2";
    }
    if (shooter.token.get(SM.quake) === true) {
        hitTips += "<br>Quake -1";
        toHitMod += 1;
    }
    if (weapon.traits.includes("Warp")) {
        if (targetUnit.type === "Knight" || targetUnit.type === "Titan") {
            _.each(targetIDArray,id => {
                attacks += parseInt(ModelArray[id].token.get("bar1_value"));
            })
        } else {
            attacks = modelIDs.length;
        }
    }

    let skyfire = false;
    if (weapon.traits.includes("Skyfire") || (shooter.special.includes("Tracking Array") && shooterUnit.order === "First Fire")) {
        skyfire = true;
    }
    if (skyfire === false && testTarget.special.includes("Flyer")) {
        needed = 6;
        hitTips = "<br>Targetting Flyers without Skyfire: 6+";
    }

    let needed= baseToHit + toHitMod;
    needed = Math.min(6,Math.max(2,needed));
    let rolls = [];
    for (let j=0;j<attacks;j++) {
        let roll = randomInteger(6);
        rollText = roll.toString();
        let roll2;
        let voidShields = parseInt(testTarget.token.get("bar2_value")) || 0;

        if (weapon.traits.includes("Accurate") && roll < needed) {
            roll2 = randomInteger(6);
            roll = roll2;
            if (hitTips.includes("Accurate") === false) {
                hitTips += "<br>Accurate";
            }
        } 
        if (shooter.special.includes("Macro-Extinction") && testTarget.scale > 2 && roll < needed) {
            roll2 = randomInteger(6);
            roll = Math.max(roll,roll2);
            if (hitTips.includes("Macro-Extinction") === false) {
                hitTips += "<br>Macro-Extinction";
            }
        }

        if (weapon.traits.includes("Ripple Fire") && roll === 1 && shooterUnit.order === "First Fire") {
            roll2 = randomInteger(6);
            roll = Math.max(roll,roll2);
            if (hitTips.includes("Ripple Fire") === false) {
                hitTips += "<br>Ripple Fire";
            }
        }
        if (weapon.traits.includes("Tracking") && testTarget.special.includes("Flyer") && roll < needed) {
            roll2 = randomInteger(6);
            roll = Math.max(roll,roll2);
            if (hitTips.includes("Tracking") === false) {
                hitTips += "<br>Tracking";
            }
        }
        
        if (roll2) {
            rollText = rollText + "/" + roll2;
        }

        if (SearchSpecials(weapon.traits,["Light"]) === true && testTarget.scale > 1) {
            roll = 0;
            rollText = 0;
            hitTips = "<br>Light Weapon's Fire pings off the Target'";
        }

        if (voidShields > 0 && SearchSpecials(weapon.traits,bypassVoid) === false && weapon.traits.includes("Shieldbane") === false && ( weapon.ap === 0 || weapon.traits.includes("Light AT")) ) {
            roll = 0;
            rollText = 0;
            hitTips += "<br>Weapon's Fire Pings off Void Shields";
        }

        if (testTarget.type === "Structure" && SearchSpecials(weapon.traits,antiStructure) === false) {
            roll = 0;
            rollText = 0;
            hitTips += "<br>Weapon's Fire takes some chunks out of the Building but is unable to Damage";
        }

        rolls.push(rollText);

        if (roll >= needed) {
            if (weapon.traits.includes("Rapid Fire") && roll === 6) {
                if (extraTips.includes("Rapid Fire") === false) {
                    hitTips += "<br>Rapid Fire";
                }
                hits++;
                let hitInfo = {
                    shooterID: shooterID,
                    weapon: weapon,
                    roll: roll,
                    needed: needed,
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
            }
            hitArray.push(hitInfo);
        }
    }

    rolls.sort();
    rolls.reverse();
    let tip = "Rolls: " + rolls.toString() + " vs " + needed + "+";
    tip = '[🎲](#" class="showtip" title="' + hitTips + ')';
    if (hits === 0) {
        line = tip + " " + shooter.name + " misses";
    } else {
        let s = (hits > 1) ? "s":"";
        line = tip + " [#FF0000]" + shooter.name + " gets " + hits + " hit" + s + " with " + weapon.name + "[/#]";
    }
    outputCard.body.push(line);

    return hitArray;



}