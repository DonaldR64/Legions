
    const CreateTemplate= (msg) => {
        let Tag = msg.content.split(";");
        let shooterID = Tag[1];
        let weaponNum = parseInt(Tag[2]);
        let shooter = ModelArray[shooterID];
        let weapon = shooter.weaponArray[weaponNum];
        SetupCard(shooter.name,"",shooter.faction);
        if (shooter.weaponsFired.includes(weaponNum)) {
            outputCard.body.push("Already Fired this Weapon this Turn");
            PrintCard();
            return;
        }
        let radius = 0;
        let templateType;
        //find radius, create token/model and add abilities - Check LOS and Fire!
        let traits = weapon.traits.split(",");
        for (let i=0;i<traits.length;i++) {
            let trait = traits[i];
            if (trait.includes("Blast")) {
                templateType = "Blast";
                radius = trait;
                radius = radius.replace(/\D/g,'') - 1;
                break;
            }
            if (trait.includes("Beam")) {
                templateType = "Beam";
                break;
            }
        }
      
        let img = "https://s3.amazonaws.com/files.d20.io/images/105823565/P035DS5yk74ij8TxLPU8BQ/thumb.png?15826799915";
        img = getCleanImgSrc(img);
        let represents = "-NAZtEQYwkNjQqZmyabb";

        let newToken = createObj("graphic", {   
            left: shooter.location.x,
            top: shooter.location.y,
            width: 70, 
            height: 70,  
            represents: represents,
            name: "Target",
            pageid: Campaign().get("playerpageid"),
            imgsrc: img,
            layer: "objects",
            aura1_color: "#FF0000",
            aura1_radius: radius,
        });
        toFront(newToken);

        //clear old abilities
        let abilArray = findObjs({  _type: "ability", _characterid: represents});
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 
        let abilityAction = "!CheckTemplateLOS;" + templateType + ";" + shooterID + ";" + newToken.id + ";" + weaponNum;
        AddAbility("Check LOS/Range",abilityAction,represents);
        abilityAction = "!Shooting;Blast;" + shooterID + ";" + newToken.id + ";No;" + weaponNum;
        AddAbility("Fire " + weapon.name,abilityAction,represents);

        let model = new Model(newToken.id,0,0);
        if (templateType === "Blast") {
            outputCard.body.push("Move Template into Place");
            outputCard.body.push("Can check LOS with Macro also")
        } else if (templateType === "Beam") {
            outputCard.body.push("Beam will Fire out towards the template location");
            outputCard.body.push("Can check Beam with Macro also")
        }

        outputCard.body.push("Select Fire when Done");
        PrintCard();
    }