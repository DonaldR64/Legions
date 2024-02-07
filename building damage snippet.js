
            let shooterTip;
            if (shooterExceptions !== "") {
                shooterTip = '[🎲](#" class="showtip" title="Shooters without Targets' + shooterExceptions + ')';
            }




            let baseToHit = parseInt(weapon.toHit);
            let baseToHitTips = "Base: " + baseToHit + "+"
            //no modifiers to hit for cover ? Watch for FAQ
- to hit and cover save


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

let hex = hexMap[ModelArray[id].hexLabel];
if (hex.hitLevel === 4) {
    needed += 2;
    extraTips += "<br>Building -2";
} else if (hex.hitLevel === 3) {
    needed += 1;
    extraTips += "<br>Terrain -1";
} else if (hex.hitLevel === 2 && ) {

}