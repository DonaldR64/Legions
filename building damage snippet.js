
            let shooterTip;
            if (shooterExceptions !== "") {
                shooterTip = '[🎲](#" class="showtip" title="Shooters without Targets' + shooterExceptions + ')';
            }




            let baseToHit = parseInt(weapon.toHit);
            let baseToHitTips = "Base: " + baseToHit + "+"
            //no modifiers to hit for cover ? Watch for FAQ

            let unitIDs = Object.keys(targetUnits);
            _.each(unitIDs,unitID => {
                let unit = UnitArray[unitID];
                let targetIDs = targetUnits[unitID];
                let attacks = weapon.dice * targetIDs.length;
                outputCard.body.push(unit.name);
                ToHitRolls(attacks,baseToHit,baseToHitTips);






            })

       //will have an array, targetUnits, with unitID as key, and the values being the ids of models that take hits
        //# of hits will be weapon.dice * # of models hit in unit

////////////



const StructureHits = (structureID,weapon,attacks) => {
    let structure = ModelArray[structureID];
    let structureWounds = parseInt(structure.token.get("bar1_value"));
    let structureSave = parseInt(structure.save);

    let extraTips = "";
    let toHit = parseInt(weapon.toHit) - 1;
    if (weapon.traits.includes("Graviton")) {
        toHit = 3;
        extraTips += "<br>Graviton";
    }
    let rolls = [];
    let hits = 0;
    for (let i=0;i<attacks;i++) {
        let roll = randomInteger(6);
        if (weapon.traits.includes("Accurate") && roll < needed) {
            roll = randomInteger(6);
            if (extraTips.includes("Accurate") === false) {
                extraTips += "<br>Accurate Used"
            }
        }
        rolls.push(roll);
        if (roll === 6 || roll >= toHit) {
            hits++;
        }
    }
    rolls.sort();
    rolls.reverse();
    shooterTip = '[🎲](#" class="showtip" title="Rolls: ' + rolls + " vs. " + toHit + "+" + extraTips + ')';
    let s = (hits ===1) ? "":"s";
    outputCard.body.push(shooterTip + " " + structure.name + " takes " + hits + " hit" + s + " from " + weapon.name);

    rolls = [];
    let ap = parseInt(weapon.ap);
    extraTips = "Base: " + structureSave;
    if (weapon.traits.includes("Bunker Buster")) {
        ap *=2;
        extraTips += "<br>Bunker Buster Weapon";
    }
    extraTips += "<br>Weapon AP: " + ap;


    let needed = structureSave - ap;
    let wounds = 0;
    for (let i=0;i<hits;i++) {
        let roll = randomInteger(6) + randomInteger(6);
        rolls.push(roll);
        if (roll < needed) {
            if (weapon.traits.includes("Graviton")) {
                gw = randomInteger(3) + 1;
                wounds += gw;
                extraTips += "Graviton Causes " + gw + " Damage";
            } else {
                wounds++;
            }
        }
    }
    rolls.sort();
    rolls.reverse();
    saveTip = '[🎲](#" class="showtip" title="Rolls: ' + rolls + " vs. " + needed + "+" + extraTips + ')';
    if (wounds === 0) {
        outputCard.body.push(saveTip + " No Damage was done!");
    } else {
        outputCard.body.push(saveTip + " It takes " + wounds + "  Damage");
    }
    
    structureWounds -= wounds;

    if (structureWounds > 0) {
        structure.token.set("bar1_value",structureWounds);
    } else {
        //destroyed



    }











}