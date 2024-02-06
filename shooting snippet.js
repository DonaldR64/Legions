const Shooting = (msg) => {
    let Tag = msg.content.split(";");
    let weaponType = Tag[1];
    let shooterID = Tag[2];
    let targetID = Tag[3];
    let ignoreCover = (Tag[4] === "Yes") ? true:false;
    let weaponNum = Tag[5] || 0; //weapon numbers if firing a single weapon eg. Titans
    let targetOnlyVisible = (Tag[6] === "Yes") ? true:false;//place a query in weapon macro, with "Target Only Visible Models|No|Yes"

    let shooter = ModelArray[shooterID];
    let shooterUnit = UnitArray[shooter.unitID];
    let results;

    SetupCard(shooterUnit.name,"Hits",shooterUnit.faction);

    if (weaponType === "Blast") {
        results = Blast(shooterID,targetID,weaponNum);
    } else if (weaponType === "Beam") {
        results = Beam(shooterID,targetID,weaponNum);
    } else if (weaponType === "Firestorm") {
        results = Firestorm(shooterID,targetID,weaponNum);
    } else {
        results = Regular(shooterID,targetID,weaponNum);
    }
    let shooterIDs = results.shooterIDs; //eligible shooters
    let shooterNotes = results.notes;
    let error = results.error;
    let targetUnitResults = results.targetUnitResults; //eligible targets organized into their units

    if (error) {
        outputCard.body.push(error); //already fired, out of arc etc
        PrintCard();
        return;
    }























}





const Regular = (shooterID,targetID,weaponNum) => {
    let shooterIDs = [];
    let shooterUnit = UnitArray[ModelArray[shooterID].unitID];
    let targetUnits = [];

    //Range, Arc, LOS












}