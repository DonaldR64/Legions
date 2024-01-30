const LI = (()=> {
    const version = '2024.1.29';
    const rules = '1.0'
    if (!state.LI) {state.LI = {}};
    const pageInfo = {name: "",page: "",gridType: "",scale: 0,width: 0,height: 0};
    const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","BB","CC","DD","EE","FF","GG","HH","II","JJ","KK","LL","MM","NN","OO","PP","QQ","RR","SS","TT","UU","VV","WW","XX","YY","ZZ","AAA","BBB","CCC","DDD","EEE","FFF","GGG","HHH","III","JJJ","KKK","LLL","MMM","NNN","OOO","PPP","QQQ","RRR","SSS","TTT","UUU","VVV","WWW","XXX","YYY","ZZZ"];

    let TerrainArray = {};
    let edgeArray = [];

    let TraitorForces = ["Deathguard"];
    let BuildingNames = ["Civitas","Militas","Imperialis","Grandus","Fortification"];

    let ModelArray = {}; //Individual Models, Tanks etc
    let UnitArray = {}; //Units of Models - Detachments
    let FormationArray = {}; //Formations of Detachments
    let nameArray = {}; //used to track #s of each type of unit
    let CheckArray = [];
    let fallbackFlag = false;

    let unitCreationInfo = {};
    let hexMap = {}; 
    let xSpacing = 75.1985619844599;
    let ySpacing = 66.9658278242677;

    const DIRECTIONS = ["Northeast","East","Southeast","Southwest","West","Northwest"];

    const Colours = {
        red: "#ff0000",
        blue: "#00ffff",
        yellow: "#ffff00",
        green: "#00ff00",
        purple: "#800080",
        black: "#000000",
    }

    const TurnMarkers = ["","https://s3.amazonaws.com/files.d20.io/images/361055772/zDURNn_0bbTWmOVrwJc6YQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055766/UZPeb6ZiiUImrZoAS58gvQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055764/yXwGQcriDAP8FpzxvjqzTg/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055768/7GFjIsnNuIBLrW_p65bjNQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055770/2WlTnUslDk0hpwr8zpZIOg/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055771/P9DmGozXmdPuv4SWq6uDvw/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055765/V5oPsriRTHJQ7w3hHRBA3A/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055767/EOXU3ujXJz-NleWX33rcgA/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055769/925-C7XAEcQCOUVN1m1uvQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/367683734/l-zY78IZqDwwBmvKudj7Fg/thumb.png?1699992368","https://s3.amazonaws.com/files.d20.io/images/367683736/KTSyH0bTNRtF06h8F3t0kQ/thumb.png?1699992368","https://s3.amazonaws.com/files.d20.io/images/367683726/MCFihVq52aTlUkv-ijdg6w/thumb.png?1699992367","https://s3.amazonaws.com/files.d20.io/images/367683728/YUy1bSEu44Hu_HlVSzv6ZQ/thumb.png?1699992367","https://s3.amazonaws.com/files.d20.io/images/367683730/pw5PgLNFCkExUtJA4JwM1Q/thumb.png?1699992367","https://s3.amazonaws.com/files.d20.io/images/367683729/wF4gNH1WKg9xB_OSrAkxsg/thumb.png?1699992367","https://s3.amazonaws.com/files.d20.io/images/367683727/PVrwoByB_5PETsd9ObPQlA/thumb.png?1699992367","https://s3.amazonaws.com/files.d20.io/images/367683732/g8kknD1sqvInESGM1X6itg/thumb.png?1699992367","https://s3.amazonaws.com/files.d20.io/images/367683731/N3KKC6lLhlZ59KOqtdQzFw/thumb.png?1699992367"];

    const TurnColours = ["","#ff0000","#9900ff","#674ea7","#0000ff","#00ffff","#4a86e8","#76a5af","#45818e","#6aa84f","#f1c232"];


    const SM = {
        fired: "status_Shell::5553215",
        moved: "status_Advantage-or-Up::2006462", //if unit moved
        fallback: "status_Fall-Back::6534650",
        charge: "status_Charge::6534651",
        firstfire: "status_First-Fire::6534652",
        advance: "status_Advance::6534653",
        march: "status_March::6534654",
    };

    let outputCard = {title: "",subtitle: "",faction: "",body: [],buttons: [],};

    const Factions = {
        "Ultramarines": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/353049529/KtPvktw8dgMFRyHJIW-i6w/thumb.png?1690989195",
            "backgroundColour": "#0437F2",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#FFD700",
            "borderStyle": "5px ridge",  
        },
        "Deathguard": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/353239057/GIITPAhD-JdRRD2D6BREWw/thumb.png?1691112406",
            "backgroundColour": "#B3CF99",
            "titlefont": "Anton",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px ridge",
        },
        "Blood Angels": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/354261572/BMAsmC28Ap91qYIfra71yw/thumb.png?1691796541",
            "backgroundColour": "#be0b07",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px ridge",
        },
        "Space Wolves": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/360961940/GOg8nIXa8AfvA3v69KT-Vw/thumb.png?1695929748",
            "backgroundColour": "#dae6ef",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px groove",
        },
        "Salamanders": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/274614673/_-mcGObetfMZtFANsG7nKA/thumb.png?1646767013",
            "backgroundColour": "#556b2f",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px groove",
        },


        "Neutral": {
            "image": "",
            "dice": "Neutral",
            "backgroundColour": "#FFFFFF",
            "titlefont": "Arial",
            "fontColour": "#FFFFFF",
            "borderColour": "#00FF00",
            "borderStyle": "5px ridge",
        },

    };

    let specialInfo = {
        "Agile": "Can make 2 90° turns during movement",
        "Armoured": "Against Light weapons - AP0 and Reroll Failed Saves",
        "Automated Sentry": "No orders issued. May fire in Movement phase when activated, if no viable targets it can fire in Advancing Fire phase instead. Fires Anti tank weapons at closest Walker, Vehicle, Super heavy Vehicle, Knight or Titan, Light weapons at closest Infantry or Cavalry, Skyfire wepons can be chosen to target closest Flyer. All other weapons fire at closest eligible enemy unit. Can fire when Engaged & Pinned. Ignore enemy Detachments that are Engaged & Pinned (including Detachments they are Engaged & pinned with).",
        "Deep Strike": 'Deploy from round 2. 2” away from enemies. Scatter d6”. If land on Structure or Impassable, Detachment destroyed. Keep 1” away from enemy models. Deploy remaining models within 2” of scattered model. If Embarked on Depp Strike Transport, deploy Transport as per Deep Strike then models disembark.',
        "Explorator Adaptation": '6+ Invulnerable Save against Barrage or Blast weapons.',
        "Feel No Pain": 'Extra 5+ Save vs Light Weapons. Deflagrate is not triggered. Not against Wounds from Close Combat.',
        "Furious Charge": '+2 Charge bonus if moved at least 1”.',
        "Implacable": 'No Morale check when losing Combat. Can choose to Withdraw or not. If no longer in base to base with enemy then Detachment remains where it is.',
        "Independent": 'Must stay within 6” of main Detachment units. Can be issued different order. Activates at same time as main unit. Also receives Fall Back order when main units is issued Fall Back order. Only considered Engaged if a model from the Independent unit is Engaged. Does need to overwatch when main unit does overwatch. If Independent and Deep Strike, must Deep Strike within 6” of main unit, no scatter.',
        "Inspire (X)": 'Friendly units within X” can use Morale.',
        "Invulnerable Save (X)": 'Alternative Save, not modified by AP.',
        "Jump Packs": 'Ignore terrain modifiers for Movement. Can Disembark from Flyers not in Hover mode. +1 CAF against garrisoned units if issued Charge order. Counts as Bulky for Transport.',
        "Line": '+2 to Tactical Strength',
        "Master Tactician": 'Can issue commands when Detachment is activated. Any friendly Detachment within 6” can change orders when activated, can also be used to give any order to Broken Detachments (e.g.: March, First Fire).',
        "Medicae": 'Feel no Pain to friendly infantry models within 4”.',
        "Steadfast": '+1 to Tactical Strength',
        "Tracking Array": 'Weapons gain Skyfire trait if model issued First Fire order.',
        "Transport (X)": 'Can transport X Infantry models. Detachments in Transport can only be issued Advance or March orders. Cannot Transport Bulky models.',
        "Void Shields (X)": 'Hits first allocated to Void Shield. Can only allocate hits with AP -1 or better. Hits with weapons of modified AP 0 are automatically discarded if at least one Void Shield is active. In End Phase roll d6 for each lost Void Shield, on each 4+ Void Shield increases by 1.',
        "Attached Deployment": 'Assign model to Detachment of the same type. If not possible, model is destroyed.',
        "Bulky": 'Cannot Embark on Transport unless specified. Counts as 2 models for Transport (X) rule.',
        "Commander": 'Assign to a Detachment within Formation. If cannot assign, then becomes its own Detachment.',
        "Forward Deployment": 'After deployment can move unit up to Move inches ignoring terrain. If both players have Forward Deployment models, roll off to see who goes first.',
        "Infiltrate": 'After all deployments, deploy anywhere > 4” from enemy. Starting with player controlling the battlefield.',
        "Loyalist": 'Can only be included with Loyalist army.',
        "Traitor": 'Can only be included with Traitor army.',
        "Unique": 'Maximum one of each type of Detachment with this rule can be included in an army.',
        "Auger Array": 'No -1 to hit penalty with Barrage and Heavy Barrage.',
        "Battlesmith": 'Extra 5+ Save for Walker, Vehicle, Superheavy Vehicle, model with Automata, Automated Sentry within 3”. Only against weapons with AP -2 or worse. Cannot be used in Close Combat.',
        "Blessed Auto-Simulacra": 'In end phase, roll d6 for each Wound the model has lost. On 5+ regain that Wound.',
        "Compact": 'Can Embark on Transports as if Infantry with Bulky special rule',
        "Dread Aura (X)": '-1 Morale to enemy and friendly units within X inches. Immune to Dread (X) of other units',
        "Drop Pods": 'Must Deep Strike. Can Deep Strike on Round 1. Drop pods do not count for Formation Break Point. After deployment, Drop Pods do need to stay within coherency of models from Detachment.',
        "Flyer": 'In Reserve can only be given Advance or March orders. Line of sight to everything and vice versa. All Point Defence weapons count as Skyfire when firing at Flyer models. Deploys on player board edge or within 8” of deployment zone. If targeted with weapons without Skyfire, needs a 6 to hit',
        "Hover": 'Flyer can stay on battlefield at End phase. Flyer can disembark troops. Can be deployed in Hover mode.',
        "Interceptor": 'After movement, can shoot at Flyer with single weapon with -2 penalty to hit. No Point Defence weapons.',
        "Ion Shield (X)": 'Alternative Save, only when firing is from Front Arc. Save reduced by 1 for weapons with AP -2/-3, reduced by 2 for weapons with AP -4 or more.',
        "Ionic Flare Shield": 'Improve Ion Shield or Invulnerable Save by 1 against Barrage or Blast.',
        "Jink (X)": 'Alternative Save not affected by AP. Cannot be used if First Fire order.',
        "Macro-Extinction Targeting Protocols": 'Re-roll failed hits vs Super heavy Vehicle, Knight, Titan. In Fights vs Super Heavy Vehicle, Knight, Titan can re roll one die.',
        "Necrotechica": 'An end phase, roll d6 for each Wound the model has lost. On 5+ regain a Wound.',
        "Nimble": 'No movement penalty through difficult terrain.',
        "Orbital Assault": 'If Orbital and Drop Pod, can fire immediately all weapons when deployed, before troops Disembark.',
        "Outflank": 'Can be deployed from round 2 anywhere on battlefield edge >8” from enemy battlefield edge. Then activates.',
        "Phosphex": 'Enemies Engaged with a Detachment with Phospex gain no positive CAF modifiers due to being garrisoned.',
        "Shield Generator (X)": 'Any model within 6” of Shield Generator (X) receives Invulnerable Save (X+). Does not apply to models targeted by enemy model also benefiting from same Shield Generator model.',
        "Scout": 'Improve any Cover Save by 1 (max 2+).',
        "Skimmer": 'No movement penalties due to terrain. With First Fire order, can “pop up attack” - assumed 100m above battlefield for LoS until end of First Fire stage.',
        "Assault Transport (X)": 'Same as Transport but can Transport Bulky models. Detachments in Transport can also receive Charge order.',
        "Large Transport (X)": 'Can also Transport Bulky Infantry (count as 1) and Walkers (count as 2).',
        "Large Assault Transport (X)": 'Can also Transport Bulky Infantry (count as 1) and Walkers (count as 2). Detachments in Transport can also receive Charge order.',
        "Beam": 'Draw line to target, roll hits against all models crossed by line. Line stops at structure or impassable terrain. Detachments in structure suffer hits. Cannot overwatch.',
        "Bypass": 'Bypass Void Shields',
        "Collapsing Singularity": 'Roll d6 before hit roll. On a 1 firing unit suffers 1 wound. On a 6 bypass ion shields, void shields, invulnerable saves.',
        "Engine Killer (X)": 'Additional X wounds to Vehicles, Super Heavy Vehicles, Knights, Titans. If weapon has Engine Killer (X) and Rend vs Vehicles, Knights, Titans: target suffers additional X Wounds if they lose in Close Combat.',
        "Firestorm": 'Flame template. Models at least 50% under template: rolls to hit. Models less than 50% under template: on a 4+ roll to hit. Firestorm with Skyfire only hits Flyer units. Firestorm without Skyfire can’t hit Flyers. No hit penalties due to area terrain. No cover saves. Can target secondary target even if main Detachment fires at another Detachment. Cannot overwatch.',
        "Graviton Pulse": 'To hit number is equal to Save of majority of target Detachment (use worse if equal different Saves; Save of “-“ requires natural 6). Ignore AP to determine Hit roll. Cannot Structures: if weapon can damage structures, Hit value is 3+. Each Save roll passed inflicts d3+1 damage. Each Save roll that is failed inflicts 0 damage. Flyers: if weapon has skyfire then follow rules above. If weapon does not have Skyfire rule then hit on 6 only.',
        "Heavy Barrage": 'Same as Barrage. Can damage structures. Target is structure: full dice vs structure, half dice vs all Detachments garrisoning. Hit structure first, if collapsed, then resolve hits against surviving models.',
        "Heavy Beam": 'Same as Beam but not stopped by Structures (still stopped by impassable).',
        "Impale": 'vs size 3+. Firing player nominates target model. Bypass Void Shields. Instead of Save roll, both player roll d6+size. Add 1 (3+ wounds remaining), add 2 (5+ wounds remaining). If firing player roll is higher, target suffers additional wounds equal to difference. No Save rolls.',
        "Neutron-Flux": 'vs Cybernetica Cortex counts as Armourbane and Shred.',
        "Power Capacitor": 'Double attack Dice if First Fire order.',
        "Psi": 'Bypass Invulnerable Saves, Cover Saves, Ion Shields and Void Shields. Cannot overwatch.',
        "Quake": 'Detachment hit by Quake weapon: half movement and -1 on rolls to hit until end of round. Ignore if hits are allocated to Void Shields.',
        "Reach": 'Can Fight models within 2” in same Combat if target model has not fought and is not already paired of. If both players have Reach, player with Initiative resolves additional Fights first.',
        "Saturation Fire": 'Targets all visible Detachments (friends and foes) within range of firing model. Roll hits against all affected Detachments. If weapon has random number of Dice, roll once and use that for each Detachment targeted.',
        "Shieldbane": 'Can be allocated to Void Shields even if they normally could not.',
        "Shock Pulse": 'vs Vehicle, Super Heavy Vehicle, Knight, Titan: halve movement and can only fire one weapon this round. Each hit allocated to Void Shield reduces Void Shield by 2 instead of 1.',
        "Shred": 'Re-roll successful Armour Save if Infantry, Cavalry, Walker.',
        "Warp": 'Dice = number of visible models within range in target Detachment. Titans cannot split Dice vs multiple target Detachments. vs Titans and Knights, attack Dice = 1. Bypass Armour Saves, Cover Saves, Invulnerable Saves, Ion Shields, Void Shields.',
        "Accurate": 'Re-roll Misses',
        "Arc (X)": 'Only shoot targets in noted arc - Front or Rear.',
        "Armourbane": 'Vehicle, Super Heavy vehicle, Knights, Titans: re roll successful Armour Save',
        "Anti-Tank": 'AP 0 vs Infantry and Cavalry',
        "Assault": 'Double Dice at half-range or less',
        "Barrage": 'Indirect fire -1 to hit. Half dice attacks against all Detachments garrisoning. Cannot overwatch.',
        'Blast (3"/5")': 'Template over target point, scatter d3+1” / d6+1”. Cannot overwatch. Models fully within template: roll to hit. Models partially within template: on 4+ roll to hit. Structure: if centre point is wholly within Structure then each model in Detachments in the structure count as partially within template. If central point not over structure, then no models in structure are hit. Detachment firing other weapons: blast template must cover at least one model from Detachments target unit. Blast with Skyfire only hits Flyer units. Blast without Skyfire does not hit Flyers. Multiple blast weapons: additional templates within 2” of first scattered template.',
        "Bombing Run": 'Can damage structures. Cannot be used in Combat Phase. Used at any time during movement, as often as the number of bombing run weapons. Target unit within 3”. If target is structure: full dice vs structure, half dice vs all Detachments garrisoning. Hit structure first, if collapsed, then resolve hits against surviving models.',
        "Bunker Buster": 'Can damage structures. AP is doubled against structures.',
        "Burrowing": 'Count as firing into rear arc. Bypass void shields.',
        "Co-axial": 'Can only fire at same target as main weapon.',
        "Deflagrate": 'Additional hit for each unsaved wound.',
        "Demolisher": 'Can damage Structures',
        "Ignores Cover": 'No negative to hit for target in area of terrain. Hit bypass Cover Saves.',
        "Light": 'Cannot damage Vehicle, Super Heavy Vehicle, Knight, Titan. Automatically discarded vs active Void Shields (irrespective of AP).',
        "Light AT": 'AP=0 vs Vehicle, Super Heavy Vehicle, Knight, Titan.',
        "Limited (X)": 'Can only be fired X times in a game',
        "Point Defence": 'Can fire at Detachment designated target or secondary target. Can fire during movement phase if Advance or March order, immediately before or after move. Can only fire Point Defence weapons once per round. In overwatch ignore -2 to hit penalty.',
        "Precise": 'Hits are allocated by the firing player.',
        "Rapid Fire": 'Additional Hit on natural 6s',
        "Rend": '+1d6 on Fights to a maximum of 6d6.',
        "Ripple Fire": 'Re-roll hits of 1 if First Fire Order',
        "Siege Weapon": 'Double range if model has not yet moved this round.',
        "Skyfire": 'Can target Flyers. If overwatch, -1 to hit instead of -2. If multiple weapons in Detachment, can fire all Skyfire weapons at another target than Detachment designated target if this secondary target is Flyer.',
        "Tracking": 'Re-roll failed hits against Flyer',
        "Wrecker (X)": 'Can attempt to destroy building when activated in First Fire or Advance Fire stage. Choose structure in base contact, opponent rolls Save, if failed Structure receives X Wounds. If model has multiple Wrecker (X) weapons, it can target multiple Structures or a single Structure. Use combined total of weapons AP for the Structure Save roll and Structure suffers combined X Wounds if Save failed.',
    }

    //LOS: true = doesnt block, false = blocks unless within same terrain
    //Cover: cover save
    //Class: Difficult, Obstructing, Dangerous, Obstacle, Impassable, Open, Structure

    const TerrainInfo = {
        "#000000": {name: "Hill 1", height: 10,los: true,cover: 7,class: "Open"},
        "#434343": {name: "Hill 2", height: 20,los: true,cover: 7,class: "Open"},  
        "#666666": {name: "Hill 3",height:30,los: true,cover: 7,class: "Open"},
        "#c0c0c0": {name: "Hill 4",height:40,los: true,cover: 7,class: "Open"},
        "#d9d9d9": {name: "Hill 5",height:50,los: true,cover: 7,class: "Open"},
        "#ffffff": {name: "Ridgeline",height: 5,los: true,cover: 7,class: "Open/Obstacle"},

        "#00ff00": {name: "Woods",height: 20,los: false,cover: 5,class: "Obstructing"},
        "#b6d7a8": {name: "Scrub",height: 0,los: true,cover: 6,class: "Difficult"},
        "#fce5cd": {name: "Craters",height: 0,los: true,cover: 6,class: "Difficult"},
        "#980000": {name: "Ruins",height: 10,los: false,cover: 5,class: "Obstructing"},



    };

    //generally obstacles and such, maybe look at being able to burn woods
    const MapTokenInfo = {
        "wall": {name: "Wall",height: 0,los: true,cover: 7,class: "Obstacle"},
        "woods": {name: "Woods",height: 20,los: false,cover: 5,class: "Obstructing"},
    }

    const simpleObj = (o) => {
        let p = JSON.parse(JSON.stringify(o));
        return p;
    };

    const getCleanImgSrc = (imgsrc) => {
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
        if(parts) {
            return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
        }
        return;
    };

    const tokenImage = (img) => {
        if (!img) {return};
        //modifies imgsrc to fit api's requirement for token
        img = getCleanImgSrc(img);
        img = img.replace("%3A", ":");
        img = img.replace("%3F", "?");
        img = img.replace("med", "thumb");
        return img;
    };

    const stringGen = () => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(randomInteger(possible.length)));
        }
        return text;
    };

    const findCommonElements = (arr1,arr2) => {
        //iterates through array 1 and sees if array 2 has any of its elements
        //returns true if the arrays share an element
        return arr1.some(item => arr2.includes(item));
    };

    const DeepCopy = (variable) => {
        variable = JSON.parse(JSON.stringify(variable))
        return variable;
    };

    const PlaySound = (name) => {
        let sound = findObjs({type: "jukeboxtrack", title: name})[0];
        if (sound) {
            sound.set({playing: true,softstop:false});
        }
    };

    const FX = (fxname,model1,model2) => {
        //model2 is target, model1 is shooter
        //if its an area effect, model1 isnt used
        if (fxname.includes("System")) {
            //system fx
            fxname = fxname.replace("System-","");
            if (fxname.includes("Blast")) {
                fxname = fxname.replace("Blast-","");
                spawnFx(model2.location.x,model2.location.y, fxname);
            } else {
                spawnFxBetweenPoints(model1.location, model2.location, fxname);
            }
        } else {
            let fxType =  findObjs({type: "custfx", name: fxname})[0];
            if (fxType) {
                spawnFxBetweenPoints(model1.location, model2.location, fxType.id);
            }
        }
    }

    const Naming = (name,faction) => {
        name = name.replace(faction + " ","");
        name = name.replace("Primaris ","");
        if (name.includes("w/")) {
            name = name.split("w/")[0];
        } else if (name.includes("//")) {
            name = name.split("//")[0];
        }
        name = name.trim();
        if (nameArray[name]) {
            nameArray[name]++;
        } else {
            nameArray[name] = 1;
        }
        name += " " + nameArray[name];

        return name;
    }

    //Retrieve Values from Character Sheet Attributes
    const Attribute = (character,attributename) => {
        //Retrieve Values from Character Sheet Attributes
        let attributeobj = findObjs({type:'attribute',characterid: character.id, name: attributename})[0]
        let attributevalue = "";
        if (attributeobj) {
            attributevalue = attributeobj.get('current');
        }
        return attributevalue;
    };

    const AttributeArray = (characterID) => {
        let aa = {}
        let attributes = findObjs({_type:'attribute',_characterid: characterID});
        for (let j=0;j<attributes.length;j++) {
            let name = attributes[j].get("name")
            let current = attributes[j].get("current")   
            if (!current || current === "") {current = " "} 
            aa[name] = current;

        }
        return aa;
    };

    const AttributeSet = (characterID,attributename,newvalue,max) => {
        if (!max) {max = false};
        let attributeobj = findObjs({type:'attribute',characterid: characterID, name: attributename})[0]
        if (attributeobj) {
            if (max === true) {
                attributeobj.set("max",newvalue)
            } else {
                attributeobj.set("current",newvalue)
            }
        } else {
            if (max === true) {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    max: newvalue,
                    characterid: characterID,
                });            
            } else {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    characterid: characterID,
                });            
            }
        }
    };

    const DeleteAttribute = (characterID,attributeName) => {
        let attributeObj = findObjs({type:'attribute',characterid: characterID, name: attributeName})[0]
        if (attributeObj) {
            attributeObj.remove();
        }
    }

    const ButtonInfo = (phrase,action) => {
        let info = {
            phrase: phrase,
            action: action,
        }
        outputCard.buttons.push(info);
    };

    const SetupCard = (title,subtitle,faction) => {
        outputCard.title = title;
        outputCard.subtitle = subtitle;
        outputCard.faction = faction;
        outputCard.body = [];
        outputCard.buttons = [];
        outputCard.inline = [];
    };

    const DisplayDice = (roll,tablename,size) => {
        roll = roll.toString();
        if (!tablename) {
            tablename = "Neutral";
        }
        let table = findObjs({type:'rollabletable', name: tablename})[0];
        let obj = findObjs({type:'tableitem', _rollabletableid: table.id, name: roll })[0];        
        let avatar = obj.get('avatar');
        let out = "<img width = "+ size + " height = " + size + " src=" + avatar + "></img>";
        return out;
    };

    const HexInfo = {
        size: {
            x: 75.1985619844599/Math.sqrt(3),
            y: 66.9658278242677 * 2/3,
        },
        pixelStart: {
            x: 37.5992809922301,
            y: 43.8658278242683,
        },
        //xSpacing: 75.1985619844599,
        halfX: 75.1985619844599/2,
        //ySpacing: 66.9658278242677,
        width: 75.1985619844599,
        height: 89.2877704323569,
        directions: {},
    };

    const M = {
            f0: Math.sqrt(3),
            f1: Math.sqrt(3)/2,
            f2: 0,
            f3: 3/2,
            b0: Math.sqrt(3)/3,
            b1: -1/3,
            b2: 0,
            b3: 2/3,
    };

    class Point {
        constructor(x,y) {
            this.x = x;
            this.y = y;
        }
    };

    class Hex {
        constructor(q,r,s) {
            this.q = q;
            this.r =r;
            this.s = s;
        }

        add(b) {
            return new Hex(this.q + b.q, this.r + b.r, this.s + b.s);
        }
        subtract(b) {
            return new Hex(this.q - b.q, this.r - b.r, this.s - b.s);
        }
        static direction(direction) {
            return HexInfo.directions[direction];
        }
        neighbour(direction) {
            //returns a hex (with q,r,s) for neighbour, specify direction eg. hex.neighbour("NE")
            return this.add(HexInfo.directions[direction]);
        }
        neighbours() {
            //all 6 neighbours
            let results = [];
            for (let i=0;i<DIRECTIONS.length;i++) {
                results.push(this.neighbour(DIRECTIONS[i]));
            }
            return results;
        }



        len() {
            return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
        }
        distance(b) {
            return this.subtract(b).len();
        }
        round() {
            var qi = Math.round(this.q);
            var ri = Math.round(this.r);
            var si = Math.round(this.s);
            var q_diff = Math.abs(qi - this.q);
            var r_diff = Math.abs(ri - this.r);
            var s_diff = Math.abs(si - this.s);
            if (q_diff > r_diff && q_diff > s_diff) {
                qi = -ri - si;
            }
            else if (r_diff > s_diff) {
                ri = -qi - si;
            }
            else {
                si = -qi - ri;
            }
            return new Hex(qi, ri, si);
        }
        lerp(b, t) {
            return new Hex(this.q * (1.0 - t) + b.q * t, this.r * (1.0 - t) + b.r * t, this.s * (1.0 - t) + b.s * t);
        }
        linedraw(b) {
            //returns array of hexes between this hex and hex 'b'
            var N = this.distance(b);
            var a_nudge = new Hex(this.q + 1e-06, this.r + 1e-06, this.s - 2e-06);
            var b_nudge = new Hex(b.q + 1e-06, b.r + 1e-06, b.s - 2e-06);
            var results = [];
            var step = 1.0 / Math.max(N, 1);
            for (var i = 0; i <= N; i++) {
                results.push(a_nudge.lerp(b_nudge, step * i).round());
            }
            return results;
        }
        label() {
            //translate hex qrs to Roll20 map label
            let doubled = DoubledCoord.fromCube(this);
            let label = rowLabels[doubled.row] + (doubled.col + 1).toString();
            return label;
        }

        radius(rad) {
            //returns array of hexes in radius rad
            //Not only is x + y + z = 0, but the absolute values of x, y and z are equal to twice the radius of the ring
            let results = [];
            let h;
            for (let i = 0;i <= rad; i++) {
                for (let j=-i;j<=i;j++) {
                    for (let k=-i;k<=i;k++) {
                        for (let l=-i;l<=i;l++) {
                            if((Math.abs(j) + Math.abs(k) + Math.abs(l) === i*2) && (j + k + l === 0)) {
                                h = new Hex(j,k,l);
                                results.push(this.add(h));
                            }
                        }
                    }
                }
            }
            return results;
        }
        angle(b) {
            //angle between 2 hexes
            let origin = hexToPoint(this);
            let destination = hexToPoint(b);

            let x = Math.round(origin.x - destination.x);
            let y = Math.round(origin.y - destination.y);
            let phi = Math.atan2(y,x);
            phi = phi * (180/Math.PI);
            phi = Math.round(phi);
            phi -= 90;
            phi = Angle(phi);
            return phi;
        }        
    };

    class DoubledCoord {
        constructor(col, row) {
            this.col = col;
            this.row = row;
        }
        static fromCube(h) {
            var col = 2 * h.q + h.r;
            var row = h.r;
            return new DoubledCoord(col, row);//note will need to use rowLabels for the row, and add one to column to translate from 0
        }
        toCube() {
            var q = (this.col - this.row) / 2; //as r = row
            var r = this.row;
            var s = -q - r;
            return new Hex(q, r, s);
        }
    };

    class Model {
        constructor(tokenID,unitID,formationID){
            let token = findObjs({_type:"graphic", id: tokenID})[0];
            let name = token.get("name");
            let hp = parseInt(token.get("bar1_value"));
            let char = getObj("character", token.get("represents")); 
            let attributeArray = AttributeArray(char.id);
            let faction = attributeArray.faction;
            let player = (TraitorForces.includes(faction)) ? 1:0;
            let type = attributeArray.type;
            let buildingInfo;
            let height = 0;
            let wounds = parseInt(attributeArray.wounds) || 1;
            let scale = parseInt(attributeArray.scale);

            if (!faction) {
                faction = "Neutral";
                player = 2;
            }
            if (type !== "Building" && type !== "System Unit") {
                if (!state.LI.models[tokenID]) {
                    name = Naming(char.get("name"),faction);
                    state.LI.models[tokenID] = {
                        unitID: unitID,
                        formationID: formationID,
                        faction: faction,
                    }
                } else {
                    unitID = state.LI.models[tokenID].unitID;
                    formationID = state.LI.models[tokenID].formationID;
                }
                if (scale === 3) {height = 5};
                if (scale === 4) {height = 10};
                if (scale === 5) {
                    if (char.get("name").includes("Warhound")) {height = 15};
                    if (char.get("name").includes("Reaver")) {height = 20};
                    if (char.get("name").includes("Warlord")) {height = 25};
                };
            } else {
                height = char.get("name").replace(/\D/g,'') * 10;
                let as,gn,w,caf,save;
                if (name.includes("Militas")) {
                    name = "Militas Imperialis";
                    as = 3;
                    gn = 2;
                    wounds = 3;
                    caf = 3;
                    save = 4;
                } else if (name.includes("Grandus")){
                    name = "Imperialis Grandus";
                    as = 4;
                    gn = 3;
                    wounds = 2;
                    caf = 2;
                    save = 4;
                } else if (name.includes("Fortification")) {
                    name = "Fortification";
                    as = 2;
                    gn = 1;
                    wounds = 2;
                    caf = 3;
                    save = 3;
                } else {
                    name = "Civitas Imperialis";
                    as = 5;
                    gn = 1;
                    wounds = 2;
                    caf = 2;
                    save = 4;
                }
                buildingInfo = {
                    height: height,
                    armourSave: as,
                    garrisonNumber: gn,
                    cafBonus: caf,
                    coverSave: save,
                }

            }

            let location = new Point(token.get("left"),token.get("top"));
            let hex = pointToHex(location);
            let hexLabel = hex.label();

            let radius = 1;
            let large = false;
            let vertices = TokenVertices(token);

            if (token.get("width") > 100 || token.get("height") > 100) {
                large = true;
                let w = token.get("width")/2;
                let h = token.get("height")/2;
                radius = Math.ceil(Math.sqrt(w*w + h*h)/70);
            }

            //weapons
            let weaponArray = [];
            let infoArray = [];

            for (let i=1;i<6;i++) {
                let wname = attributeArray["weapon"+i+"name"];
                let wequipped = attributeArray["weapon"+i+"equipped"];
                if (wequipped !== "Equipped") {continue};
                if (!wname || wname === "" || wname === undefined || wname === " ") {continue};
                let r = attributeArray["weapon"+i+"range"];
                let minRange = 0;
                let maxRange;
                if (r === "Template") {
                    maxRange = "Template";
                } else if (r.includes("-")) {
                    r = r.split("-")
                    minRange = parseInt(r[0]);
                    maxRange = parseInt(r[1]);
                } else {
                    maxRange= parseInt(r);
                }
                let dice = attributeArray["weapon"+i+"dice"];
                let tohit = parseInt(attributeArray["weapon"+i+"tohit"]) || 0;
                let ap = attributeArray["weapon"+i+"ap"] || 0;
                if (ap !== "Special") {
                    ap = parseInt(ap);
                }
                let traits = attributeArray["weapon"+i+"traits"] || " ";
                let fx = attributeArray["weapon"+i+"fx"];
                let sound = attributeArray["weapon"+i+"sound"];

                let weapon = {
                    name: wname,
                    minRange: minRange,
                    maxRange: maxRange,
                    dice: dice,
                    tohit: tohit,
                    ap: ap,
                    traits: traits,
                    fx: fx,
                    sound: sound,
                }

                weaponArray.push(weapon);

                traits = traits.split(",");
                _.each(traits,trait => {
                    trait = trait.trim();
                    infoArray.push(trait);
                });
            }

            //update sheet with info
            let specials = attributeArray.special;
            if (!specials || specials === "") {
                specials = " ";
            }
            specials = specials.split(",");
            for (let i=0;i<specials.length;i++) {
                let special = specials[i].trim();
                let attName = "special" + i;
                AttributeSet(char.id,attName,special);
                infoArray.push(special);
            }

            infoArray = [...new Set(infoArray)];

            infoArray.sort(function (a,b) {
                let a1 = a.charAt(0).toLowerCase();
                let b1 = b.charAt(0).toLowerCase();
                if (a1<b1) {return -1};
                if (a1>b1) {return 1};
                return 0;
            });
            for (let i=0;i<10;i++) {
                let specName = infoArray[i];
                if (!specName || specName === "") {continue}
                if (specName.includes("(")) {
                    let index = specName.indexOf("(");
                    specName = specName.substring(0,index);
                    specName = specName.trim();
                    specName += " (X)";
                }
                if (specName.includes("+")) {
                    let index = specName.indexOf("+");
                    specName = specName.substring(0,index);
                    specName = specName.trim();
                    specName += "+X";
                }
                let specInfo = specialInfo[specName];
                if (specName) {
                    specName += ": ";
                }
                if (!specInfo && specName) {
                    specInfo = "Not in Database Yet";
                }
                let atName = "spec" + (i+1) + "Name";
                let atText = "spec" + (i+1) + "Text";

                if (!specName) {
                    DeleteAttribute(char.id,atName);
                } else {
                    AttributeSet(char.id,atName,specName);
                    AttributeSet(char.id,atText,specInfo);
                }
            }

            let special = infoArray.toString();
            if (!special || special === "" || special === " ") {
                special = " ";
            }

            this.name = name;
            this.type = type;
            this.id = tokenID;
            this.unitID = unitID;
            this.formationID = formationID;
            this.rank = parseInt(attributeArray.rank) || 1;
            this.player = player;
            this.faction = faction;
            this.location = location;
            this.hex = hex;
            this.hexLabel = hexLabel;
            this.startHex = hex;
            this.special = special;
            this.wounds = wounds;
            this.token = token;

            this.save = parseInt(attributeArray.save) || 7;
            this.caf = parseInt(attributeArray.caf) || 0;
            this.morale = parseInt(attributeArray.morale) || 0;
            this.movement = parseInt(attributeArray.movement) || 0;

            this.weaponArray = weaponArray;
            this.buildingInfo = buildingInfo;
            this.height = height;
            this.scale = scale;
            this.radius = radius;
            this.vertices = vertices;
            this.large = large;
            this.largeHexList = []; //hexes that have parts of larger token, mainly for LOS 
            hexMap[hexLabel].tokenIDs.push(token.id);
            if (this.large === true) {
                LargeTokens(this); 
            }
            ModelArray[tokenID] = this;

            let unit = UnitArray[this.unitID];
            if (unit) {
                unit.add(this);
            }
        }




    }

    class Unit {
        constructor(faction,unitID,unitName,formationID) {
            if (!state.LI.units[unitID]) {
                state.LI.units[unitID] = {
                    name: unitName,
                    formationID: formationID,
                }
            } else {
                unitName = state.LI.units[unitID].name;
                formationID = state.LI.units[unitID].formationID;
            }

            let player = (TraitorForces.includes(faction)) ? 1:0;

            this.id = unitID;
            this.formationID = formationID;
            this.name = unitName;
            this.modelIDs = [];
            this.player = player;
            this.faction = faction;
            this.order = "";
            this.moraleCheck = false;

            this.type = "";
            this.scale = 1;
            this.hitArray = []; //used to track hits
            UnitArray[unitID] = this;

            let formation = FormationArray[this.formationID];
            formation.add(this);
        }

        add(model) {
            if (this.modelIDs.includes(model.id) === false) {
//add COmmanders?
                if (model.token.get("aura1_color") === Colours.green) {
                    this.modelIDs.unshift(model.id);
                } else {
                    this.modelIDs.push(model.id);
                    this.modelIDs.sort((a,b) => {
                        return parseInt(ModelArray[b].rank) - parseInt(ModelArray[a].rank);
                    })
                }
                this.type = model.type;
                this.scale = model.scale;
            }
        }

        remove(model) {
            let index = this.modelIDs.indexOf(model.id);
            if (index > -1) {
                this.modelIDs.splice(index,1);
                if (index === 0 && this.modelIDs.length > 0) {
                    let ac = model.token.get("aura1_color");
                    let stm = model.token.get("statusmarkers");
                    ModelArray[this.modelIDs[0]].token.set({
                        aura1_color: ac,
                        statusmarkers: stm,
                    })
                }
            }
            if (this.modelIDs.length === 0) {
                //Unit Destroyed
                delete UnitArray[this.id];
            }
        }

        halfStrength() {
///change needed
            let result = false;
            if (((this.modelIDs.length <= Math.floor(state.LI.unitStrength[this.id] / 2)) || (state.LI.unitStrength[this.id] === 1 && parseInt(ModelArray[this.modelIDs[0]].token.get("bar1_value")) <= Math.floor(parseInt(ModelArray[this.modelIDs[0]].token.get("bar1_max")))/2))) {
                result = true;
            }
            return result;
        }

        resetFlags() {
            if (this.order !== "Fall Back") {
                _.each(this.modelIDs,id => {
                    let model = ModelArray[id];
                    if (model) {
                        model.token.set(SM.charge,false);
                        model.token.set(SM.firstfire,false);
                        model.token.set(SM.advance,false);
                        model.token.set(SM.march,false);
                        model.token.set(SM.fired,false);
                        model.token.set(SM.moved,false);
                        if (id === this.modelIDs[0]) {
                            model.token.set("aura1_color",Colours.green);
                        }
                    }
                });
                this.order = "";
                this.moraleCheck = false;

            } else {
                this.moraleCheck = true; //Units with Fall Back take no further morale checks
            }


        }

        moraleCheck() {
            if (this.moraleCheck = true) {
                return; //only one per turn
            }
            let needed = 7;
            _.each(this.modelIDs,modelID => {
                let model = ModelArray[modelID];
                needed = Math.min(needed,model.morale);
            });
            let tip = "<br>Base: " + needed + "+";
            let formation = FormationArray[this.formationID];
            if (needed === 0) {
                tip += "<br>Automatic";
            }
            if (formation.broken === true && needed > 0) {
                tip += "<br>Formation Broken +1";
                needed += 1;
            }
            //other mods

            let roll = randomInteger(6);
            tip = "Roll: " + roll + " vs. " + needed + "+" + tip;
            tip = '[🎲](#" class="showtip" title="' + tip + ')';
            if (roll < needed) {
                outputCard.body.push(tip + " [#ff0000]Morale Check Failed[/#]");
                if (order === "Fall Back") {
                    outputCard.body.push("[#ff0000]Detachment remains on Fallback[/#]");
                } else {
                    outputCard.body.push("[#ff0000]Detachment goes on Fallback[/#]");
                }
                let mark = SM[this.order.toLowerCase()];
                _.each(this.modelIDs,id => {
                    let model = ModelArray[id];
                    if (model) {
                        model.token.set(mark,false);
                        model.token.set(SM.fallback,true);
                        if (id === this.modelIDs[0]) {
                            model.token.set("aura1_color",Colours.black);
                        }
                    }
                });
                this.order = "Fallback";
                this.moraleCheck = true;
                return "Failed";
            } else {
                outputCard.body.push(tip + " Morale Check Passed");
                this.moraleCheck = true;
                return "Passed";            
            }
        }




    }

    class Formation {
        constructor(faction,id,name) {
            let breakPoint = 0;
            let broken = false;
            if (!state.LI.formations[id]) {
                state.LI.formations[id] = {
                    name: name,
                    breakPoint: 0,
                    broken: false,
                }
            } else {
                name = state.LI.formations[id].name;
                breakPoint = state.LI.formations[id].breakPoint;
                broken = state.LI.formations[id].broken
            }
            this.name = name;
            this.breakPoint = breakPoint;
            this.broken = broken;
            this.id = id;
            this.faction = faction;
            this.unitIDs = [];

            FormationArray[id] = this;
        }

        add(unit) {
            if (this.unitIDs.includes(unit.id) === false) {
                this.unitIDs.push(unit.id);
                unit.formationID = this.id;
            }
        }

        checkBroken() {
            let hp = 0;
            _.each(this.unitIDs,unitID => {
                let unit = UnitArray[unitID];
                _.each(unit.modelIDs,modelID => {
                    let model = ModelArray[modelID];
                    if (parseInt(model.scale) > 3) {
                        hp += parseInt(model.token.get("bar1_value"));
                    } else {
                        hp += 1;
                    }
                });
            });
            if (hp <= Math.round(this.breakPoint/2)) {
                this.broken = true;
                state.LI.formations[id].broken = true;
                outputCard.body.push("[B]The Formation - " + this.name + " is Broken[/b]");
                return true;
            } else {
                return false;
            }
        }


    }




    const UnitMarkers = ["Plus-1d4::2006401","Minus-1d4::2006429","Plus-1d6::2006402","Minus-1d6::2006434","Plus-1d20::2006409","Minus-1d20::2006449","Hot-or-On-Fire-2::2006479","Animal-Form::2006480","Red-Cloak::2006523","A::6001458","B::6001459","C::6001460","D::6001461","E::6001462","F::6001463","G::6001464","H::6001465","I::6001466","J::6001467","L::6001468","M::6001469","O::6001471","P::6001472","Q::6001473","R::6001474","S::6001475"];


    const ModelDistance = (model1,model2) => {
        let hexes1 = [model1.hex];
        let hexes2 = [model2.hex];
        if (model1.large === true) {
            hexes1 = model1.largeHexList;
        }
        if (model2.large === true) {
            hexes2 = model2.largeHexList;
        }
        if (model1.type === "Infantry" && hexMap[model1.hexLabel].buildingID.length > 0) {
            //Infantry in building, use building hexes for LOS
            let buildingModel = ModelArray[hexMap[model1.hexLabel].buildingID];
            if (buildingModel) {
                hexes1 = buildingModel.largeHexList;
            }
        } 
        if (model2.type === "Infantry" && hexMap[model2.hexLabel].buildingID.length > 0) {
            //Infantry in building, use building hexes for LOS
            let buildingModel = ModelArray[hexMap[model2.hexLabel].buildingID];
            if (buildingModel) {
                hexes2 = buildingModel.largeHexList;
            }
        } 
        let closestDist = Infinity;
        let closestHex1 = model1.hex;
        let closestHex2 = model2.hex;

        for (let i=0;i<hexes1.length;i++) {
            let hex1 = hexes1[i];
            for (let j=0;j<hexes2.length;j++) {
                let hex2 = hexes2[j];
                let dist = hex1.distance(hex2);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestHex1 = hex1;
                    closestHex2 = hex2;
                }
            }
        }
        closestDist -= 1; //as its distance between bases
        let arc = Arc(model1,model2);

        let info = {
            distance: closestDist,
            arc: arc,
            hex1: closestHex1,
            hex2: closestHex2,
        }
        return info;
    }

    const pointToHex = (point) => {
        let x = (point.x - HexInfo.pixelStart.x)/HexInfo.size.x;
        let y = (point.y - HexInfo.pixelStart.y)/HexInfo.size.y;
        let q = M.b0 * x + M.b1 * y;
        let r = M.b2 * x + M.b3 * y;
        let s = -q-r;
        let hex = new Hex(q,r,s);
        hex = hex.round();
        return hex;
    }

    const hexToPoint = (hex) => {
        let q = hex.q;
        let r = hex.r;
        let x = (M.f0 * q + M.f1 * r) * HexInfo.size.x;
        x += HexInfo.pixelStart.x;
        let y = (M.f2 * r + M.f3 * r) * HexInfo.size.y;
        y += HexInfo.pixelStart.y;
        let point = new Point(x,y);
        return point;
    }


    const getAbsoluteControlPt = (controlArray, centre, w, h, rot, scaleX, scaleY) => {
        let len = controlArray.length;
        let point = new Point(controlArray[len-2], controlArray[len-1]);
        //translate relative x,y to actual x,y 
        point.x = scaleX*point.x + centre.x - (scaleX * w/2);
        point.y = scaleY*point.y + centre.y - (scaleY * h/2);
        point = RotatePoint(centre.x, centre.y, rot, point);
        return point;
    }

    const XHEX = (pts) => {
        //makes a small group of points for checking around centre
        let points = pts;
        points.push(new Point(pts[0].x - 20,pts[0].y - 20));
        points.push(new Point(pts[0].x + 20,pts[0].y - 20));
        points.push(new Point(pts[0].x + 20,pts[0].y + 20));
        points.push(new Point(pts[0].x - 20,pts[0].y + 20));
        return points;
    }

    const Angle = (theta) => {
        while (theta < 0) {
            theta += 360;
        }
        while (theta > 360) {
            theta -= 360;
        }
        return theta
    }   

    const RotatePoint = (cX,cY,angle, p) => {
        //cx, cy = coordinates of the centre of rotation
        //angle = clockwise rotation angle
        //p = point object
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        // translate point back to origin:
        p.x -= cX;
        p.y -= cY;
        // rotate point
        let newX = p.x * c - p.y * s;
        let newY = p.x * s + p.y * c;
        // translate point back:
        p.x = Math.round(newX + cX);
        p.y = Math.round(newY + cY);
        return p;
    }

    const pointInPolygon = (point,polygon) => {
        //evaluate if point is in the polygon
        px = point.x
        py = point.y
        collision = false
        vertices = polygon.vertices
        len = vertices.length - 1
        for (let c=0;c<len;c++) {
            vc = vertices[c];
            vn = vertices[c+1]
            if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) && (px < (vn.x-vc.x)*(py-vc.y)/(vn.y-vc.y)+vc.x)) {
                collision = !collision
            }
        }
        return collision
    }

    const ClearLarge = (model) => {
        //clear Old hexes, if any
        for (let h=0;h<model.largeHexList.length;h++) {
            let chlabel = model.largeHexList[h].label();
            let index = hexMap[chlabel].tokenIDs.indexOf(model.id);
            if (index > -1) {
                hexMap[chlabel].tokenIDs.splice(index,1);
            }                    
        }        
        model.largeHexList = [];
    }


    const LargeTokens = (model) => {
        ClearLarge(model);
        //adds tokenID to hexMap for LOS purposes
        let radiusHexes = model.hex.radius(model.radius);
        for (let i=0;i<radiusHexes.length;i++) {
            let radiusHex = radiusHexes[i];
            let radiusHexLabel = radiusHex.label();
            if (radiusHexLabel === model.hexLabel) {continue};
            if (!hexMap[radiusHexLabel]) {continue};
            let c = hexMap[radiusHexLabel].centre;
            let check = false;
            let num = 0;
            let pts = [];
            pts.push(c);
            pts = XHEX(pts);
            for (let i=0;i<5;i++) {
                check = pointInPolygon(pts[i],model);
                if (check === true) {num ++};
            }
            if (num > 2) {
                if (hexMap[radiusHexLabel].tokenIDs.includes(model.id) === false) {
                    hexMap[radiusHexLabel].tokenIDs.push(model.id);
                }
                model.largeHexList.push(radiusHex);
            }
        }
    }


    const TokenVertices = (tok) => {
      //Create corners with final being the first
      let corners = []
      let tokX = tok.get("left")
      let tokY = tok.get("top")
      let w = tok.get("width")
      let h = tok.get("height")
      let rot = tok.get("rotation") * (Math.PI/180)
      //define the four corners of the target token as new points
      //also rotate those corners around the target tok centre
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY-h/2 )))     //Upper left
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX+w/2, tokY-h/2 )))     //Upper right
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX+w/2, tokY+h/2 )))     //Lower right
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY+h/2 )))     //Lower left
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY-h/2 )))     //Upper left
      return corners
    }


    const PrintCard = (id) => {
        let output = "";
        if (id) {
            let playerObj = findObjs({type: 'player',id: id})[0];
            let who = playerObj.get("displayname");
            output += `/w "${who}"`;
        } else {
            output += "/desc ";
        }

        if (!outputCard.faction || !Factions[outputCard.faction]) {
            outputCard.faction = "Neutral";
        }

        if (outputCard.faction === "Neutral") {
            let turn = state.LI.turn;
            Factions["Neutral"]["borderColour"] = TurnColours[turn];
            Factions["Neutral"]["backgroundColour"] = TurnColours[turn];
            Factions["Neutral"]["fontColour"] = (turn === 1 || turn === 3 || turn === 5 || turn === 7 || turn === 10) ? "#000000":"#FFFFFF";
        }


        //start of card
        output += `<div style="display: table; border: ` + Factions[outputCard.faction].borderStyle + " " + Factions[outputCard.faction].borderColour + `; `;
        output += `background-color: #EEEEEE; width: 100%; text-align: center; `;
        output += `border-radius: 1px; border-collapse: separate; box-shadow: 5px 3px 3px 0px #aaa;;`;
        output += `"><div style="display: table-header-group; `;
        output += `background-color: ` + Factions[outputCard.faction].backgroundColour + `; `;
        output += `background-image: url(` + Factions[outputCard.faction].image + `), url(` + Factions[outputCard.faction].image + `); `;
        output += `background-position: left,right; background-repeat: no-repeat, no-repeat; background-size: contain, contain; align: center,center; `;
        output += `border-bottom: 2px solid #444444; "><div style="display: table-row;"><div style="display: table-cell; padding: 2px 2px; text-align: center;"><span style="`;
        output += `font-family: ` + Factions[outputCard.faction].titlefont + `; `;
        output += `font-style: normal; `;

        let titlefontsize = "1.4em";
        if (outputCard.title.length > 12) {
            titlefontsize = "1em";
        }

        output += `font-size: ` + titlefontsize + `; `;
        output += `line-height: 1.2em; font-weight: strong; `;
        output += `color: ` + Factions[outputCard.faction].fontColour + `; `;
        output += `text-shadow: none; `;
        output += `">`+ outputCard.title + `</span><br /><span style="`;
        output += `font-family: Arial; font-variant: normal; font-size: 13px; font-style: normal; font-weight: bold; `;
        output += `color: ` +  Factions[outputCard.faction].fontColour + `; `;
        output += `">` + outputCard.subtitle + `</span></div></div></div>`;

        //body of card
        output += `<div style="display: table-row-group; ">`;

        let inline = 0;

        for (let i=0;i<outputCard.body.length;i++) {
            let out = "";
            let line = outputCard.body[i];
            if (!line || line === "") {continue};
            if (line.includes("[INLINE")) {
                let end = line.indexOf("]");
                let substring = line.substring(0,end+1);
                let num = substring.replace(/[^\d]/g,"");
                if (!num) {num = 1};
                line = line.replace(substring,"");
                out += `<div style="display: table-row; background: #FFFFFF;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: center; display:block;'>`;
                out += line + " ";

                for (let q=0;q<num;q++) {
                    let info = outputCard.inline[inline];
                    out += `<a style ="background-color: ` + Factions[outputCard.faction].backgroundColour + `; padding: 5px;`
                    out += `color: ` + Factions[outputCard.faction].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
                    out += `border-color: ` + Factions[outputCard.faction].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                    out += `"href = "` + info.action + `">` + info.phrase + `</a>`;
                    inline++;                    
                }
                out += `</div></span></div></div>`;
            } else {
                line = line.replace(/\[hr(.*?)\]/gi, '<hr style="width:95%; align:center; margin:0px 0px 5px 5px; border-top:2px solid $1;">');
                line = line.replace(/\[\#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\](.*?)\[\/[\#]\]/g, "<span style='color: #$1;'>$2</span>"); // [#xxx] or [#xxxx]...[/#] for color codes. xxx is a 3-digit hex code
                line = line.replace(/\[[Uu]\](.*?)\[\/[Uu]\]/g, "<u>$1</u>"); // [U]...[/u] for underline
                line = line.replace(/\[[Bb]\](.*?)\[\/[Bb]\]/g, "<b>$1</b>"); // [B]...[/B] for bolding
                line = line.replace(/\[[Ii]\](.*?)\[\/[Ii]\]/g, "<i>$1</i>"); // [I]...[/I] for italics
                let lineBack = (i % 2 === 0) ? "#D3D3D3" : "#EEEEEE";
                out += `<div style="display: table-row; background: ` + lineBack + `;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: center; display:block;'>`;
                out += line + `</div></span></div></div>`;                
            }
            output += out;
        }

        //buttons
        if (outputCard.buttons.length > 0) {
            for (let i=0;i<outputCard.buttons.length;i++) {
                let out = "";
                let info = outputCard.buttons[i];
                out += `<div style="display: table-row; background: #FFFFFF;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: center; display:block;'>`;
                out += `<a style ="background-color: ` + Factions[outputCard.faction].backgroundColour + `; padding: 5px;`
                out += `color: ` + Factions[outputCard.faction].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
                out += `border-color: ` + Factions[outputCard.faction].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                out += `"href = "` + info.action + `">` + info.phrase + `</a></div></span></div></div>`;
                output += out;
            }
        }

        output += `</div></div><br />`;
        sendChat("",output);
        outputCard = {title: "",subtitle: "",faction: "",body: [],buttons: [],};
    }

    const LoadPage = () => {
        //build Page Info and flesh out Hex Info
        pageInfo.page = getObj('page', Campaign().get("playerpageid"));
        pageInfo.name = pageInfo.page.get("name");
        pageInfo.scale = pageInfo.page.get("snapping_increment");
        pageInfo.width = pageInfo.page.get("width") * 70;
        pageInfo.height = pageInfo.page.get("height") * 70;

        pageInfo.page.set("gm_opacity",1);

        HexInfo.directions = {
            "Northeast": new Hex(1, -1, 0),
            "East": new Hex(1, 0, -1),
            "Southeast": new Hex(0, 1, -1),
            "Southwest": new Hex(-1, 1, 0),
            "West": new Hex(-1, 0, 1),
            "Northwest": new Hex(0, -1, 1),
        }

        let edges = findObjs({_pageid: Campaign().get("playerpageid"),_type: "path",layer: "map",stroke: "#d5a6bd",});
        let c = pageInfo.width/2;
        for (let i=0;i<edges.length;i++) {
            edgeArray.push(edges[i].get("left"));
        }
        if (edgeArray.length === 0) {
            sendChat("","Add Edge(s) to map and reload API");
            return;
        } else if (edgeArray.length === 1) {
            if (edgeArray[0] < c) {
                edgeArray.push(pageInfo.width)
            } else {
                edgeArray.unshift(0);
            }
        } else if (edgeArray.length === 2) {
            edgeArray.sort((a,b) => parseInt(a) - parseInt(b));
        } else if (edgeArray.length > 2) {
            sendChat("","Error with > 2 edges, Fix and Reload API");
            return
        }
    }

    const BuildMap = () => {
        let startTime = Date.now();
        hexMap = {};
        //builds a hex map, assumes Hex(V) page setting
        let halfToggleX = HexInfo.halfX;
        let rowLabelNum = 0;
        let columnLabel = 1;
        let startX = xSpacing/2;
        let startY = 43.8658278242683;

        for (let j = startY; j <= pageInfo.height;j+=ySpacing){
            let rowLabel = rowLabels[rowLabelNum];
            for (let i = startX;i<= pageInfo.width;i+=xSpacing) {
                let point = new Point(i,j);     
                let label = (rowLabel + columnLabel).toString(); //id of hex
                let hexInfo = {
                    id: label,
                    centre: point,
                    terrain: [], //array of names of terrain in hex
                    buildingID: [],
                    tokenIDs: [], //ids of tokens in hex
                    elevation: 0, //based on hills, in metres
                    height: 0, //height of top of terrain over elevation
                    nonHillHeight: 0,//height of trees etc above hills
                    cover: 7,
                    obstacleTerrain: false,
                    los: true,
                    obstructingTerrain: false,
                };
                hexMap[label] = hexInfo;
                columnLabel += 2;
            }
            startX += halfToggleX;
            halfToggleX = -halfToggleX;
            rowLabelNum += 1;
            columnLabel = (columnLabel % 2 === 0) ? 1:2; //swaps odd and even
        }
        BuildTerrainArray();

        let taKeys = Object.keys(TerrainArray);

        let keys = Object.keys(hexMap);
        _.each(keys,key => {
            let c = hexMap[key].centre;
            if (c.x >= edgeArray[1] || c.x <= edgeArray[0]) {
                //Offboard
                hexMap[key].terrain = ["Offboard"];
            } else {
                let temp = DeepCopy(hexMap[key]);
                for (let t=0;t<taKeys.length;t++) {
                    let polygon = TerrainArray[taKeys[t]];
                    if (!polygon) {continue};
                    if (polygon.linear === true) {continue};
                    if (temp.terrain.includes(polygon.name)) {continue};
                    let check = false;
                    let pts = [];
                    pts.push(c);
                    pts = XHEX(pts);
                    let num = 0;
                    for (let i=0;i<5;i++) {
                        check = pointInPolygon(pts[i],polygon);
                        if (i === 0 && check === true) {
                            //centre pt is in hex, can skip rest
                            num = 3;
                            break;
                        }
                        if (check === true) {num ++};
                    }
                    if (num > 2) {
                        temp.terrain.push(polygon.name);
                        temp.cover = Math.min(temp.cover,polygon.cover);
                        if (polygon.los === false) {
                            temp.los = false;
                        }
                        if (polygon.class === "Obstructing") {
                            temp.obstructingTerrain = true;
                        }
                        if (polygon.class === "Obstacle") {
                            temp.obstacleTerrain = true;
                        }
                        if (polygon.name.includes("Hill")) {
                            temp.elevation = Math.max(temp.elevation,polygon.height);
                            temp.height = Math.max(temp.height,(polygon.height + temp.nonHillHeight));
                        } else {
                            temp.nonHillHeight = Math.max(temp.nonHillHeight,polygon.height);
                            temp.height = Math.max(temp.height,(temp.nonHillHeight + temp.elevation));
                        };
                    };
                };
                if (temp.terrain.length === 0) {
                    temp.terrain.push("Open Ground");
                }
                hexMap[key] = temp;
            }
        })

        for (let i=0;i<taKeys.length;i++) {
            let polygon = TerrainArray[taKeys[i]];
            if (polygon.linear === true) {
                Ridgeline(polygon);
            };
        }

        let elapsed = Date.now()-startTime;
        log("Hex Map Built in " + elapsed/1000 + " seconds");
        //add tokens to hex map, rebuild team/Unit Arrays
        RebuildArrays();
    }

    const BuildTerrainArray = () => {
        TerrainArray = {};
        //first look for graphic lines outlining hills etc
        let paths = findObjs({_pageid: Campaign().get("playerpageid"),_type: "path",layer: "map"});
        paths.forEach((pathObj) => {
            let vertices = [];
            toFront(pathObj);
            let colour = pathObj.get("stroke").toLowerCase();
            let t = TerrainInfo[colour];
            if (!t) {return};  
            let path = JSON.parse(pathObj.get("path"));
            let centre = new Point(pathObj.get("left"), pathObj.get("top"));
            let w = pathObj.get("width");
            let h = pathObj.get("height");
            let rot = pathObj.get("rotation");
            let scaleX = pathObj.get("scaleX");
            let scaleY = pathObj.get("scaleY");

            //covert path vertices from relative coords to actual map coords
            path.forEach((vert) => {
                let tempPt = getAbsoluteControlPt(vert, centre, w, h, rot, scaleX, scaleY);
                if (isNaN(tempPt.x) || isNaN(tempPt.y)) {return}
                vertices.push(tempPt);            
            });
            let id = stringGen();
            if (TerrainArray[id]) {
                id += stringGen();
            }

            let linear = (t.name === "Ridgeline") ? true:false;

            let info = {
                name: t.name,
                pathID: pathObj.id,
                id: id,
                vertices: vertices,
                centre: centre,
                height: t.height,
                cover: t.cover,
                class: t.class,
                los: t.los,
                linear: linear,
            };
            TerrainArray[id] = info;
        });
        //add tokens on map eg woods, crops
        let mta = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map"});
        mta.forEach((token) => {
            let truncName = token.get("name").toLowerCase();
            truncName = truncName.trim();
            let t = MapTokenInfo[truncName];
            if (!t) {
                return;
            };
            let vertices = TokenVertices(token);
            let centre = new Point(token.get('left'),token.get('top'));
            let info = {
                name: t.name,
                id: token.id,
                vertices: vertices,
                centre: centre,
                height: t.height,
                cover: t.cover,
                move: t.move,
                los: t.los,
                linear: false,
            };
            TerrainArray[id] = info;
        });
    };

    const RebuildArrays = () => {
        FormationArray = {}
        UnitArray = {};
        TeamArray = {};
        let startTime = Date.now();
        let tokenArray = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "objects",});
        _.each(tokenArray,token => {
            let char = getObj("character", token.get("represents")); 
            let unitID,formationID;
            if (char) {
                let modelInfo = state.LI.models[token.id];
                let formation,unit,model;
                if (modelInfo) {
                    formation = FormationArray[modelInfo.formationID];
                    if (!formation) {
                        formation = new Formation(modelInfo.faction,modelInfo.formationID);
                    }
                    unit = UnitArray[modelInfo.unitID];
                    if (!unit) {
                        unit = new Unit(modelInfo.faction,modelInfo.unitID);
                    }
                    model = new Model(token.id,unit.id,formation.id);
                }
                let type = Attribute(char,"type");
                if (type === "Building") {
                    model = new Model(token.id)
//add back into terrain array, based on side
                    AddBuilding(model);
                }




            }
        });
        let elapsed = Date.now()-startTime;
        log(tokenArray.length + " Teams added to array in " + elapsed/1000 + " seconds");
    }

    const Ridgeline = (polygon) => {
        //adds Ridgelines, to hex map
        let vertices = polygon.vertices;
        for (let i=0;i<(vertices.length - 1);i++) {
            let hexes = [];
            let pt1 = vertices[i];
            let pt2 = vertices[i+1];
            let hex1 = pointToHex(pt1);
            let hex2 = pointToHex(pt2);
            hexes = hex1.linedraw(hex2);
            for (let j=0;j<hexes.length;j++) {
                let hex = hexes[j];
                let hexLabel = hex.label();
                if (!hexMap[hexLabel]) {continue};
                if (hexMap[hexLabel].terrain.includes("Ridgeline")) {continue};
                hexMap[hexLabel].terrain.push("Ridgeline");
                hexMap[hexLabel].height += 5;
                hexMap[hexLabel].elevation += 5;
                hexMap[hexLabel].obstacleTerrain = true;

            }
        }
    }


    const modelElevation = (model) => {
        let hex = hexMap[model.hexLabel];
        let elevation = parseInt(hex.elevation);
        if (hex.buildingID.length > 0 && model.type === "Infantry") {
            elevation = parseInt(hex.height);
        }
        if (model.type === "Aircraft") {
            elevation = 200;
        }
        //elevation += model.height;
        return elevation;
    }


    const LOS = (id1,id2,special) => {

        if (!special) {special = " "};
        let model1 = ModelArray[id1];
        let model2 = ModelArray[id2];
        if (!model1 || !model2) {
            let info = (!model1) ? "Model 1":"Model2";
            sendChat("",info + " is not in Model Array");
            return "Error"
        }
        let model1Hex = hexMap[model1.hexLabel];
        let model2Hex = hexMap[model2.hexLabel];
        let shooterHexes = [model1.hex];
        let targetHexes = [];
        if (model1.type === "Infantry" && model1Hex.buildingID.length > 0) {
            //Infantry in building, use building hexes for LOS
            let buildingModel = ModelArray[model1Hex.buildingID];
            if (buildingModel) {
                shooterHexes = buildingModel.largeHexList;
            }
        } 
        if (model2.large === true || (model2.type === "Infantry" && model2Hex.buildingID.length > 0)) {
            //finds the hexes closest to shooter hex
            let targetHexLabels = [];
            let sorted = (model2.large === true) ? model2.largeHexList:ModelArray[model2Hex.buildingID].largeHexList;
            sorted = sorted.sort(function (a,b) {
                let aDist = a.distance(model1.hex);
                let bDist = b.distance(model1.hex);
                return aDist - bDist; //closest first
            })
            tloop1:
            for (let i=0;i<sorted.length;i++) {
                let tar = sorted[i];
                let line = model1.hex.linedraw(tar);                
                for (let j=0;j<line.length;j++) {
                    let h = line[j].label();
                    if (targetHexLabels.includes(h)) {
                        continue tloop1;
                    }
                }
                targetHexLabels.push(tar.label());
                targetHexes.push(tar);
            }
        } else {
            targetHexes = [model2.hex];
        }
    
        let finalLOS = false;
        let losReason;
        let finalCover = model2Hex.cover;
        let model1Height = modelElevation(model1) + model1.height;
        let model2Base = modelElevation(model2);
        let model2Height = model2Base + model2.height;
        if (model2.size < 4) {model2Base = model2Height};
    
        let losCase,level;
    
        if (model2Height >= model1Height && model2Base >= model1Height) {
            losCase = 1; //Target points higher than Shooter, bring all down to level of shooter
            level = model1Height;
        } else if (model2Height < model1Height && model2Base < model1Height) {
            losCase = 2; //Target points lower than Shooter, bring all down to lowest level of target
            level = model2Base;
        } else {
            losCase = 3; //Target points bracket the shooter, bring down to lowest level of target
            level = model2Base;
        }
    
        model1Height -= level;
        model2Height -= level;
        model2Base -= level;
    
    
    log("Team1 Height: " + model1Height)
    log("Team2 Base Elev: " + model2Base)
    log("Team2 Total Height: " + model2Height)
    
        let md = ModelDistance(model1,model2);
        let finalArc = md.arc;
        let distanceT1T2 = md.distance; 
    
        //Flyers see all and are seen by all
        if (model1.special.includes("Flyer") || model2.special.includes("Flyer")) {
            if (model2.special.includes("Flyer")) {
                cover = 7
            }
            let result = {
                distance: distanceT1T2,
                arc: finalArc,
                los: true,
                cover: finalCover,
                losReason: "",
                percent: 1,
            }
            return result;
        }
      
        let fractions = 0;
        shooterHexLoop:
        for (let s=0;s<shooterHexes.length;s++) {
            let shooterHex = shooterHexes[s];
    log("Shooter Hex: " + shooterHex.label())
    
            targetHexLoop:
            for (let t=0;t<targetHexes.length;t++) {
                let targetHex = targetHexes[t];
    log("Target Hex: " + targetHex.label())
                let targetLOS = 1;
                let interHexes = shooterHex.linedraw(targetHex); //hexes between shotoer and target
    
                let lastElevation = model1Height; //track hill height as go
    
                interHexLoop:
                for (let i=1;i<interHexes.length - 1;i++) {
                    let interHex = interHexes[i];
                    let ihLabel = interHex.label();
    log(i + ": " + ihLabel)
    
                    let hex = hexMap(ihLabel);
                    let hexLOS = hex.los;
    //if in same terrain peice as shooter and obstrucing than can see still, so modify this here
    
                    let interHexElevation = parseInt(hex.elevation) - level;
                    let interHexHeight = interHexElevation + parseInt(hex.height);
                    let B1,B2;
    
                    if (losCase === 1) {
                        B1 = model2Base/distanceT1T2 * i;
                        B2 = model2Height/distanceT1T2 * i;
                    } else if (losCase === 2) {
                        B1 = model1Height/distanceT1T2 * (distanceT1T2 - i);
                        B2 = (((model1Height - model2Height)/distanceT1T2) * (distanceT1T2 - i)) + B1;
                    } else if (losCase === 3) {
                        B1 = model1Height/distanceT1T2 * (distanceT1T2 - i);
                        B2 = (((model2Height - model1Height)/distanceT1T2) * i) + model1Height;
                    }
    
    log("InterHex Elevation: " + interHexElevation);
    log("Last Elevation: " + lastElevation);
    log("InterHex Height: " + interHexHeight);
    
    
    log("B1: " + B1)
    log("B2: " + B2)
    
                    //Hills
                    if (interHexElevation < lastElevation) {
                        if (lastElevation > B2) {
                            //fully blocks LOS
                            targetLOS = 0;
                            losReason = "Terrain Drops Off";
                            break interHexLoop;
                        } else if (lastElevation > B1 && lastElevation <= B2) {
                            //partially blocks LOS
                            log("Partial block by Hill")
                            targetLOS = Math.min((lastElevation - B1) / (B2 - B1),targetLOS);
                        } 
                    }
                    //Units in way
                    if (hex.tokenIDs.length > 0) {
                        let id3s = hex.tokenIDs;
                        for (let j=0;j<id3s.length;j++) {
                            let id3 = id3s[j];
                            let model3 = ModelArray[id3];
                            if (!model3) {continue};
                            if (model3.type === "System Unit" || model3.type === "Building" || model3.scale < 2 || model3.unitID === model1.unitID || model3.unitID === model2.unitID) {
                                continue;
                            };
                            let model3Height = modelElevation(model3) + model3.height - level;
    log(model3.name)
    log("Height: " + model3Height)
                            if (model3Height > B2) {
                                //fully blocks LOS
                                targetLOS = 0;
                                losReason = "LOS blocked by " + model3.name;
                                break interHexLoop;
                            } else if (model3Height > B1 && model3Height <= B2) {
                                //partially blocks LOS
                                log("Partial block by Unit")
                                targetLOS = Math.min((model3Height - B1) / (B2 - B1),targetLOS);
                            } 
                        }
                    }
                    //Terrain in hex
                    if (interHexHeight > B2 && hexLOS === false) {
                        //fully blocks LOS
                        targetLOS = 0;
                        losReason = "LOS blocked by Terrain";
                        break interHexLoop;
                    } else if (interHexHeight > B1 && interHexHeight <= B2 && hexLOS === false) {
                        //partially blocks LOS
                        log("Partial block by Terrain")
                        targetLOS = Math.min((interHexHeight - B1) / (B2 - B1),targetLOS);
                    } else {
                        log("Overlooks Terrain in Hex")
                    }
    
                } //end interHex Loop
    
                if (model2.size < 4 && targetLOS > 0) {
                    //not a knight, can see a portion of it, so has LOS
                    finalLOS = true;
                    break shooterHexLoop;
                }  
    
                if (targetLOS > 0) {
                    if (model2.size < 4) {
                        //not a knight, can see a portion of it, so has LOS
                        finalLOS = true;
                        break shooterHexLoop;
                    } else {
                        //need to add up fractions
                        fractions += targetLOS;
                    }
                }
            }//end targetHex Loop
        } //end shooterHex Loop
    
        if (model2.size > 3) {
            fractions = fractions / (shooterHexes.length * targetHexes.length);
    log(fractions)
            if (fractions > 0) {
                targetLOS = true;
            }
        }
    
        let result = {
            distance: distanceT1T2,
            arc: finalArc,
            los: finalLOS,
            cover: finalCover,
            losReason: losReason,
            percent: fractions,
        }
        return result;
    }
    




    const RollD6 = (msg) => {
        let Tag = msg.content.split(";");
        PlaySound("Dice");
        let roll = randomInteger(6);
        if (Tag.length === 1) {
            let playerID = msg.playerid;
            let side = "Neutral";
            if (!state.LI.players[playerID] || state.LI.players[playerID] === undefined) {
                if (msg.selected) {
                    let id = msg.selected[0]._id;
                    if (id) {
                        let tok = findObjs({_type:"graphic", id: id})[0];
                        let char = getObj("character", tok.get("represents")); 
                        faction = Attribute(char,"faction");
                        side = (TraitorForces.includes(faction)) ? "Traitor":"Loyalist";
                        state.LI.players[playerID] = side;
                        state.LI.factions[playerID] = faction;
                    }
                } else {
                    sendChat("","Click on one of your tokens then select Roll again");
                    return;
                }
            } else {
                side = state.LI.players[playerID];
            }
            let res = "/direct " + DisplayDice(roll,side,40);
            sendChat("player|" + playerID,res);
        } else {
            if (Tag[1] === "Morale") {
                let unitID = Tag[2];
                let unit = UnitArray[unitID];
                let result = unit.moraleCheck();
                let flip;
                if (result === "Passed") {
                    unit.order = "";
                    flip = false;
                } else {
                    unit.order = "Fallback";
                    flip = true;
                }
                _.each(unit.modelIDs,id => {
                    let model = ModelArray[id];
                    model.token.set(SM.fallback,flip);
                });
            }
        }
    }

    const ClearState = () => {
        //clear arrays
        ModelArray = {};
        UnitArray = {};
        FormationArray = {};
        //clear token info
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        })
        tokens.forEach((token) => {
            if (token.get("name").includes("Objective") === true) {return};

            token.set({
                name: "",
                tint_color: "transparent",
                aura1_color: "transparent",
                aura1_radius: 0,
                showplayers_bar1: true,
                showname: true,
                showplayers_aura1: true,
                bar1_value: 0,
                bar1_max: "",
                gmnotes: "",
                statusmarkers: "",
                tooltip: "",
                lockMovement: false,
            });                
        });
    
        RemoveDead("All");
        RemoveDepLines();

        let tmID = (edgeArray[0] === 0) ? [""]:["",""];

        state.LI = {
            players: {}, //keyed by playerID, shows which side
            factions: {}, //factions, keyed by playerID
            markers: [[],[]],
            turn: 0,
            phase: "",
            lineArray: [],
            models: {}, //unitIDs, formationIDs
            units: {}, //unitIDs -> names, formationIDs
            formations: {}, //names and starting strength
            objectives: [],
            deployLines: [],
            mission: '1',
            turnMarkerIDs: tmID,
            buildings: {},
        }
        for (let i=0;i<UnitMarkers.length;i++) {
            state.LI.markers[0].push(i);
            state.LI.markers[1].push(i);
        }
        sendChat("","Cleared State/Arrays");
    }

    const RemoveDepLines = () => {
        for (let i=0;i<state.LI.deployLines.length;i++) {
            let id = state.LI.deployLines[i];
            let path = findObjs({_type: "path", id: id})[0];
            if (path) {
                path.remove();
            }
        }
    }

    const UnitCreation = (msg) => {
        let Tag = msg.content.split(";");
        let unitName = Tag[1];
        let tokenIDs = [];
        for (let i=0;i<msg.selected.length;i++) {
            tokenIDs.push(msg.selected[i]._id);
        }
        if (tokenIDs.length === 0) {return};
        let refToken = findObjs({_type:"graphic", id: tokenIDs[0]})[0];
        let refChar = getObj("character", refToken.get("represents")); 
        let faction = Attribute(refChar,"faction");

        let formationKeys = Object.keys(FormationArray);
        SetupCard("Unit Creation","",faction);
        let newID = stringGen();
        outputCard.body.push("Select Existing Formation or New");
        ButtonInfo("New","!UnitCreation2;" + newID + ";?{Formation Name}");
        for (let i=0;i<formationKeys.length;i++) {
            let formation = FormationArray[formationKeys[i]];
            if (formation.faction !== faction) {continue};
            let action = "!UnitCreation2;" + formation.id;
            ButtonInfo(formation.name,action);
        }

        PrintCard();

        unitCreationInfo = {
            faction: faction,
            tokenIDs: tokenIDs,
            unitName: unitName,
        }
    }

    const UnitCreation2 = (msg) => {
        let Tag = msg.content.split(";");
        let unitName = unitCreationInfo.unitName;
        let faction = unitCreationInfo.faction;
        let player = (TraitorForces.includes(faction)) ? 1:0;
        let tokenIDs = unitCreationInfo.tokenIDs;
        let formationID = Tag[1];
        let formation = FormationArray[formationID];
        if (!formation) {
            formation = new Formation(faction,formationID,Tag[2]);
        }

        SetupCard("Unit Creation","",faction);
        let unitID = stringGen();
        let unit = new Unit(faction,unitID,unitName,formationID);
        let markerNumber = state.LI.markers[player].length;
        if (!markerNumber || markerNumber === 0) {
            markerNumber = 1;   
        } else {
            markerNumber = randomInteger(markerNumber);
            state.LI.markers[player].splice(markerNumber-1,1);
        }
        unit.symbol = UnitMarkers[markerNumber-1];
        for (let i=0;i<tokenIDs.length;i++) {
            let tokenID = tokenIDs[i];
            let model = new Model(tokenID,unitID,formationID);
            model.token.set({
                name: model.name,
                tint_color: "transparent",
                showplayers_bar1: true,
                showname: true,
                bar1_value: model.wounds,
            })
            if (parseInt(model.wounds) > 1) {
                model.token.set("bar1_max",model.wounds);
            }
            if (parseInt(model.scale) > 3) {
                formation.breakPoint += model.wounds;
                state.LI.formations[formationID].breakPoint += model.wounds;
            } else {
                formation.breakPoint += 1;
                state.LI.formations[formationID].breakPoint += 1;
            }
            model.token.set("statusmarkers","");
            model.token.set("status_"+unit.symbol,true);
        }

        let leader = ModelArray[unit.modelIDs[0]];
        if (leader) {
            leader.token.set({
                aura1_color: Colours.green,
                aura1_radius: 0.2,
            })
        } else {
            log("No Leader")
            log(unit)
        }


 
        sendChat("",unitName + " Created");





    }


    const TokenInfo = (msg) => {
        if (!msg.selected) {
            sendChat("","No Token Selected");
            return;
        };
        let id = msg.selected[0]._id;
        let model = ModelArray[id];
        if (!model) {
            sendChat("","Not in Model Array Yet");
            return;
        };
        let faction = model.faction;
        if (!faction) {faction = "Neutral"};
        let requestingPlayerID = msg.playerid;
        let ownUnit = (state.LI.factions[requestingPlayerID] === faction) ? true:false;

        if (model.type === "Building") {
            SetupCard(model.name,"",faction);
            let side = parseInt(model.token.get("currentSide"));
            if (side === 0) {
                outputCard.body.push("Wounds: " + model.token.get("bar1_value"));
                outputCard.body.push("Height: " + model.buildingInfo.height);
                outputCard.body.push("Armour Save: " + model.buildingInfo.armourSave + "+");
                outputCard.body.push("Garrison Number: " + model.buildingInfo.garrisonNumber);
                outputCard.body.push("CAF Bonus: +" + model.buildingInfo.cafBonus);
                outputCard.body.push("Cover Save: " + model.buildingInfo.coverSave + "+");
            } else {
                outputCard.body.push("Building is in Ruins");
                outputCard.body.push("Height: 1");
                outputCard.body.push("Cover Save: 5+");
            }


        } else if (model.type !== "System Unit" && model.type !== "Building") {
            SetupCard(model.name,"Hex: " + model.hexLabel,faction);
            let h = hexMap[model.hexLabel];
            let terrain = h.terrain;
            terrain = terrain.toString();
            let elevation = modelElevation(model);
            let cover = h.cover;
            let unit = UnitArray[model.unitID];
            let save = parseInt(model.save);
    
            outputCard.body.push("Terrain: " + terrain);
            if (cover < 7) {
                if (cover < save) {
                    outputCard.body.push("Cover Save: " + cover + "+");
                } else {
                    outputCard.body.push("No Benefit from Cover Save");
                }
            } 
            if (h.obstacleTerrain === true && model.scale < 3) {
                outputCard.body.push("Gets -1 to hit due to Obstacle");
            }
            outputCard.body.push("Height: " + elevation);
            if (unit) {
                outputCard.body.push("[hr]");
                outputCard.body.push("Unit: " + unit.name);
                if (state.LI.phase === "Orders" && ownUnit === true) {
                    outputCard.body.push("Order: " + unit.order);
                } else {
                    outputCard.body.push("Order: " + unit.order);
                }

                for (let i=0;i<unit.modelIDs.length;i++) {
                    let m = ModelArray[unit.modelIDs[i]];
                    let name = m.name;
                    if (i===0) {
                        name += " (Leader)"
                    }
                    outputCard.body.push(name);
                }
            }


        }
        if (state.LI.phase === "Orders" && ownUnit === true) {
            PrintCard(requestingPlayerID);
        } else {
            PrintCard();
        }
    }

    const DrawLine = (id1,id2,w,layer) => {
        let ColourCodes = ["#00ff00","#ffff00","#ff0000","#00ffff","#000000"];
        let colour = ColourCodes[w];


        let x1 = hexMap[ModelArray[id1].hexLabel].centre.x + w*15;
        let x2 = hexMap[ModelArray[id2].hexLabel].centre.x + w*15;
        let y1 = hexMap[ModelArray[id1].hexLabel].centre.y + w*15;
        let y2 = hexMap[ModelArray[id2].hexLabel].centre.y + w*15;

        let width = (x1 - x2);
        let height = (y1 - y2);
        let left = width/2;
        let top = height/2;

        let path = [["M",x1,y1],["L",x2,y2]];
        path = path.toString();

        let newLine = createObj("path", {   
            _pageid: Campaign().get("playerpageid"),
            _path: path,
            layer: layer,
            fill: colour,
            stroke: colour,
            stroke_width: 5,
            left: left,
            top: top,
            width: width,
            height: height,
        });

        let id = newLine.id;
        return id;
    }

    const DeploymentLines = (x1,x2,y1,y2) => {
        let width = (x1 - x2);
        let height = (y1 - y2);
        let left = width/2;
        let top = height/2;

        let path = [["M",x1,y1],["L",x2,y2]];
        path = path.toString();

        let newLine = createObj("path", {   
            _pageid: Campaign().get("playerpageid"),
            _path: path,
            layer: "map",
            fill: "#FF0000",
            stroke: "#FF0000",
            stroke_width: 5,
            left: left,
            top: top,
            width: width,
            height: height,
        });
        toFront(newLine);
        let id = newLine.id;
        return id;
    }


    const RemoveLines = () => {
        let lineIDArray = state.LI.lineArray;
        if (!lineIDArray) {
            state.LI.lineArray = [];
            return;
        }
        for (let i=0;i<lineIDArray.length;i++) {
            let id = lineIDArray[i];
            let path = findObjs({_type: "path", id: id})[0];
            if (path) {
                path.remove();
            }
        }
        state.LI.lineArray = [];  
    }



    const AddAbility = (abilityName,action,charID) => {
        createObj("ability", {
            name: abilityName,
            characterid: charID,
            action: action,
            istokenaction: true,
        })
    }    

    const AddAbilities = (msg) => {
        if (!msg) {return}
        let id = msg.selected[0]._id;
        if (!id) {return};
        let token = findObjs({_type:"graphic", id: id})[0];
        let char = getObj("character", token.get("represents"));
        if (!char) {return};
        let model = ModelArray[id];
        if (!model) {return};

        let abilityName,action;
        let abilArray = findObjs({_type: "ability", _characterid: char.id});
        //clear old abilities
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 

    }


    const Objectives = () => {
        let count = [0,0,0];
        for (let i=0;i<state.LI.objectives.length;i++) {
            let objective = state.LI.objectives[i];
            let keys = Object.keys(ModelArray);
            let modelsInRange = [false,false];
            let objToken = findObjs({_type:"graphic", id: objective.id})[0];
            for (let k=0;k<keys.length;k++) {
                let model = ModelArray[keys[k]];
                if (model.type === "Aircraft") {continue};
                let unit = UnitArray[model.unitID];
                if (unit.shakenCheck() === true) {continue};
                if (model.special.includes("Ambush") && unit.deployed === state.LI.turn) {
                    continue;
                }
                let distance = ModelDistance(model,objective).distance;
                if (distance > 3) {continue};
                modelsInRange[model.player] = true;
            }
            let side;
            if (modelsInRange[0] === true && modelsInRange[1] === true) {
                side = 2;
            } else if (modelsInRange[0] === true && modelsInRange[1] === false) {
                side = 0;
            } else if (modelsInRange[0] === false && modelsInRange[1] === true) {
                side = 1;
            } else if (modelsInRange[0] === false && modelsInRange[1] === false) {
                side = parseInt(objToken.get("currentSide"));
            }
            let img = objToken.get("sides").split("|");
            img = img[side];
            objToken.set({
                currentSide: side,
                imgsrc: img,
            });
            count[side]++;
        }
        return count;
    } 

    const StartGame = () => {
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });
        for (let i=0;i<tokens.length;i++) {
            let token = tokens[i];
            let char = getObj("character", token.get("represents"));
            let name = char.get("name").split(" ");
            if (name[0] === "Objective") {
                let sides = [];     
                let image = tokenImage("https://s3.amazonaws.com/files.d20.io/images/353910541/qTDBir-RF9CMfb_Bj4aMRw/thumb.png?1691543455");   
                sides.push(image);     
                image = tokenImage("https://s3.amazonaws.com/files.d20.io/images/353910386/0pN3w44koPbLgfGvNmqpwA/thumb.png?1691543381");   
                sides.push(image);
                let objNum = parseInt(name[1]) - 1;
                let images = ["https://s3.amazonaws.com/files.d20.io/images/306331520/L67AAVS8GOrbFdWQMcg6JA/thumb.png?1664136875","https://s3.amazonaws.com/files.d20.io/images/306333377/ujCJ26GwCQblS4YxGtTJGA/thumb.png?1664137412","https://s3.amazonaws.com/files.d20.io/images/306334101/tByHNVqk10c0Rw2WX9pJpw/thumb.png?1664137597","https://s3.amazonaws.com/files.d20.io/images/306334428/y1rD_5GiD6apA9VOppxDcA/thumb.png?1664137681","https://s3.amazonaws.com/files.d20.io/images/306335099/fru3LTmrDslxAbHI-ALPUg/thumb.png?1664137844"];
                image = tokenImage(images[objNum]);
                sides.push(image);
                sides = sides.toString();
                sides = sides.replace(/,/g,"|");
                token.set({
                    sides: sides,
                    currentSide: 2,
                    imgsrc: neutral,
                    height: 140,
                    width: 140,
                    layer: "map",
                });
                let location = new Point(token.get("left"),token.get('top'));
                let hex = pointToHex(location);
                let obj = {
                    id: token.id,
                    hex: hex,
                }
                state.LI.objectives.push(obj);
            } else if (findCommonElements(BuildingNames,name) === true) {
                //reset buildings
                let buildingModel = new Model(token.id);
                let sides = token.get("sides").split("|");
                if (sides[0] !== "") {
                    img = tokenImage(sides[0]);
                    if (img) {
                        token.set({
                            currentSide: 0,
                            imgsrc: img,
                        });
                    }
                }
                token.set({
                    bar1_value: buildingModel.wounds,
                    bar1_max: buildingModel.wounds,
                    lockMovement: true,
                    name: buildingModel.name,
                });
                toBack(token);
                AddBuilding(buildingModel); //adds to map
            }
        }
        state.LI.turn = 1;
        state.LI.phase = "";
        PlaceTurnMarkers()
        NextPhase2("End");
    }

    const PlaceTurnMarkers = () => {
        let tmIDs = state.LI.turnMarkerIDs;
        let turn = state.LI.turn;
        for (let i=0;i<tmIDs.length;i++) {
            let tmID = tmIDs[i];
            let turnMarker = findObjs({_type:"graphic", id: tmID})[0];
            if (!turnMarker) {
                PlaceTurnMarker(i);
            } else {
                let newImg = getCleanImgSrc(TurnMarkers[turn]);
                turnMarker.set("imgsrc",newImg);
            }
        }       
    }



    const UserImage = (msg) => {
        output = _.chain(msg.selected)
        .map( s => getObj('graphic',s._id))
        .reject(_.isUndefined)
        .map( o => o.get('imgsrc') )
        .map( getCleanImgSrc )
        .reject(_.isUndefined)
        .map(u => `<div><img src="${u}" style="max-width: 3em;max-height: 3em;border:1px solid #333; background-color: #999; border-radius: .2em;"><code>${u}</code></div>`)
        .value()
        .join('') || `<span style="color: #aa3333; font-weight:bold;">No selected tokens have images in a user library.</span>`
        ;
        output = '<div>' + output + '</div>'
        sendChat("",output);
    }

    const PlaceTurnMarker = (num) => {
        let turnMarker = getCleanImgSrc(TurnMarkers[state.LI.turn]);        
        let alt = (num === 0) ? 1:0
        let x = Math.floor(((pageInfo.width * alt) + edgeArray[alt]) / 2);
        let y = Math.floor((pageInfo.height/2));
        let newToken = createObj("graphic", {   
            left: x,
            top: y,
            width: 210, 
            height: 210,  
            name: "Turn",
            pageid: Campaign().get("playerpageid"),
            imgsrc: turnMarker,
            layer: "map",
        });
        toFront(newToken);
        state.LI.turnMarkerIDs[num] = newToken.id;
    }

    const AddBuilding = (model) => {
        let hexes = model.largeHexList;
        let side = parseInt(model.token.get("currentSide"));
        let cover = model.buildingInfo.coverSave;
        let height = parseInt(model.height);
        let name = model.name;
        if (side > 0) {
            name = "Ruins";
            cover = 5;
            height = 10;
        } 
    
        _.each(hexes,hex => {
            if (hexMap[hex.label()].terrain.includes(name) === false) {
                hexMap[hex.label()].terrain.push(model.name);
                hexMap[hex.label()].buildingID = model.id;
                hexMap[hex.label()].cover = cover;
                hexMap[hex.label()].los = false;
                hexMap[hex.label()].obstructingTerrain = true;
                hexMap[hex.label()].nonHillHeight = Math.max(hexMap[hex.label()].nonHillHeight,height);
                hexMap[hex.label()].height = Math.max(hexMap[hex.label()].height,(hexMap[hex.label()].elevation + hexMap[hex.label()].nonHillHeight));
            }
        })
    }

    const Arc = (model1,model2) => { //which arc target b is in relative to shooter a
        let arc = "Front";
        let alpha = model1.hex.angle(model2.hex); //angle from shooter to target
        let beta = Angle(model1.token.get("rotation")); //rotational angle of shooter
        let theta = Angle(alpha - beta);
        if (theta > 90 && theta < 270) {arc = "Rear"};
        return arc;
    }

    const RemoveDead = (info) => {
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "map",
        });
        tokens.forEach((token) => {
            if (token.get("status_dead") === true) {
                token.remove();
            }
            let removals = ["Objective","Turn"];
            for (let i=0;i<removals.length;i++) {
                if (token.get("name").includes(removals[i]) && info === "All") {
                    token.remove();
                }
            }
        });
    }

    const destroyGraphic = (tok) => {
        if (tok.get('subtype') === "token") {
            let model = ModelArray[tok.id];
            if (!model) {return};
            if (model.type === "Building") {
                if (model.token.get("lockMovement") === true) {
                    t = simpleObj(tok);
                    delete t.id
                    let sides = tok.get("sides").split("|");
                    let side = tok.get("currentSide") || 0;
                    if (sides[side] !== "") {
                        img = tokenImage(sides[side]);
                        if (img) {
                            t.imgsrc = img;
                            t.currentSide = side;
                        }
                    }
                    newTok = createObj('graphic',t);
                    delete ModelArray[tok.id];
                    new Model(newTok.id);
                }

            } else if (model.type !== "System Unit" && model.type !== "Building") {
                            //model.kill();

            }            
        }
    }

    const CheckLOS = (msg) => {
        let Tag = msg.content.split(";");
        let shooterID = Tag[1];
        let shooter = ModelArray[shooterID];
        let targetID = Tag[2];
        let target = ModelArray[targetID];
        SetupCard(shooter.name,"LOS",shooter.faction);
        let checkLOS = LOS(shooterID,targetID);
        outputCard.body.push("[B]" + target.name + "[/b]");
        if (checkLOS.los === false) {
            outputCard.body.push("No LOS to Target");
            outputCard.body.push(checkLOS.losReason);
        } else if (checkLOS === "Error") {
            outputCard.body.push("Error")            
        } else {
            outputCard.body.push("Shooter has LOS");
            outputCard.body.push("Distance: " + checkLOS.distance);
            outputCard.body.push("Target is in " + checkLOS.arc + " Arc");
            if (parseInt(checkLOS.cover) < 7) {
                outputCard.body.push("Cover Save of " + checkLOS.cover + "+");
            }
            if (target.size > 3 && checkLOS.percent < 1) {
                if (checkLOS.percent <= .75 && checkLOS.percent > .5) {
                    outputCard.body.push("Target is Partially Obscured, -1 to hit");
                } else if (checkLOS.percent <= .5) {
                    outputCard.body.push("Target is Fairly Obscured, -2 to hit");
                }
            }
        }
        PrintCard();
    }

    const DeploymentZones = () => {
        return

        let type = randomInteger(6).toString();
        if (state.LI.options[0] === false) {
            type = '1';
        }
        let x0,y0,x1,x2,y1,y2,m,b1,b2,lineID;
        switch(type) {
            case '1':
                outputCard.body.push("Front Line");
                outputCard.body.push("Dice Roll, Winner picks top or bottom and deploys first");
                x1 = 0;
                x2 = pageInfo.width;
                //top line
                y1 = Math.round(pageInfo.height/2) - (12*ySpacing);
                y2 = y1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                y1 = Math.round(pageInfo.height/2) + (12*ySpacing);
                y2 = y1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                break;
            case '2':
                outputCard.body.push("Long Haul");
                outputCard.body.push("Dice Roll, Winner picks left or right and deploys first");
                x1 = EDGE/2 - (12*xSpacing);
                x2 = x1;
                y1 = 0;
                y2 = pageInfo.height;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                x1 = EDGE/2 + (12*xSpacing);
                x2 = x1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                break;
            case '3':
                outputCard.body.push("Side Battle");
                outputCard.body.push("Dice Roll, Winner picks a corner and deploys first");
                x1 = 0;
                y1 = 0;
                x2 = EDGE;
                y2 = pageInfo.height;
                x0 = x2 - x1;
                y0 = y2 - y1;
                m = y0/x0;//slope of line
                b1 = 0;
                b2 = 12*140*1.414*((m*m)-1);
                y1 = b2;
                y2 = x2 * m + b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                y1 = -b2;
                y2 = x2 * m - b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);

                break;
            case '4':
                outputCard.body.push("Ambush");
                outputCard.body.push("Dice Roll, Winner can choose to deploy in centre or in corners");
                x1 = 0;
                y1 = 0;
                x2 = EDGE;
                y2 = pageInfo.height;
                x0 = x2 - x1;
                y0 = y2 - y1;
                m = y0/x0;//slope of line
                b1 = 0;
                b2 = 6*140*1.414*((m*m)-1);
                y1 = b2;
                y2 = x2 * m + b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                y1 = -b2;
                y2 = x2 * m - b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                b2 = 24*140*1.414*((m*m)-1);
                y1 = b2;
                y2 = x2 * m + b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                y1 = -b2;
                y2 = x2 * m - b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                break;
            case '5':
                outputCard.body.push("Spearhead");
                outputCard.body.push("Dice Roll, Winner can choose to deploy on left or right");
                x1 = EDGE/2 - (12*xSpacing);
                y1 = Math.round(pageInfo.height/2);
                x2 = 0;
                y2 = 0;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                y2 = pageInfo.height;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                x1 = EDGE/2 + (12*xSpacing);
                x2 = EDGE;
                y2 = 0;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                y2 = pageInfo.height;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                break;
            case '6':
                outputCard.body.push("Flank Attack");
                outputCard.body.push("Dice Roll, Winner can choose to deploy on left or right");
                x1 = EDGE/2 - (12*xSpacing);
                y1 = Math.round(pageInfo.height/2);
                x2 = 0;
                y2 = y1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                x2 = x1;
                y2 = 0;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                x1 = EDGE/2 + (12*xSpacing);
                x2 = EDGE;
                y2 = y1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                x2 = x1;
                y2 = pageInfo.height;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                break;
        }
    }

    const NextPhase = () => {
        if (state.LI.turn === 0) {
            StartGame();
            return;
        }
        let currentPhase = state.LI.phase;
        CheckArray = [];
        if (currentPhase === "Orders") {
            //checks to see if unordered units
            _.each(UnitArray,unit => {  
                if (unit.order === "") {
                    CheckArray.push(unit);
                }
            });
            if (CheckArray.length > 0) {
                SetupCard("Orders Incomplete","","Neutral");
                ButtonInfo("Review Units","!Checks;Orders");
                PrintCard();
                return;
            }
        } else if (currentPhase === "Movement") {   
             //checks to see if any unactivated units
             _.each(UnitArray,unit => {  
                let unitLeader = ModelArray[unit.modelIDs[0]];
                if (unitLeader) {
                    if (unitLeader.token.get("aura1_color") === Colours.green) {
                        CheckArray.push(unit);
                    }
                }
            });
            if (CheckArray.length > 0) {
                SetupCard("Movement Phase","","Neutral");
                ButtonInfo("Review Units","!Checks;Movement");
                PrintCard();
                return;
            }
        //? else for first fire etc?


        } else if (currentPhase === "End") {
            _.each(UnitArray,unit => {
                unit.resetFlags();
            });
            state.LI.turn += 1;
            PlaceTurnMarkers();
        } 
        NextPhase2(currentPhase);
    }
    
    const NextPhase2 = (phase) => {
        //all req to advance cleared
        let turn = state.LI.turn;
        let phases = ["Orders","Movement","First Fire","Close Combat","Advancing Fire","End"];
        let phaseNum = ((phases.indexOf(phase) + 1) > 4) ? 0:(phases.indexOf(phase) + 1);
        phase = phases[phaseNum];
        state.LI.phase = phase;
        SetupCard("Turn: " + turn,phase + " Phase","Neutral");
    
        if (phase === "Orders") {
            outputCard.body.push("Issue Orders to each Detachment");
            outputCard.body.push("Including Reserves and Transported Troops");
            outputCard.body.push("Excluding Detachments with Fall Back");
        } else if (phase === "Movement") {            
            RevealOrders();
            ResetActivations(phase);
            outputCard.body.push("Players roll for Initiative");
            outputCard.body.push("Starting with Player with Initiative, take turns moving Detachments");
            outputCard.body.push("Detachments on First Fire can only be activated to Overwatch Fire");
            outputCard.body.push("Reserves arriving on Battlefield (e.g. Flyers, Deep Strikes etc.) can be activated normally");
            outputCard.body.push("Reserves remaining offtable cannot be activated until end");
        } else if (phase === "First Fire") {
            ResetActivations(phase);

        } else if (phase === "Close Combat") {
            
        } else if (phase === "Advancing Fire") {
            ResetActivations(phase);
            
        } else if (phase === "End") {
            //checks to see if any units with fall back and need morale check
            //need a flag for first pass being morale checks then once all done into flyers, end phase
            _.each(UnitArray,unit => {  
                if (unit.order === "Fall Back") {
                    CheckArray.push(unit);
                }
            });
            if (CheckArray.length > 0 && fallbackFlag === false) {
                //go to each unit, tell player to move, then roll morale check
                Checks("Morale");
                return;
            }
            outputCard.body.push("Remove Flyers");



            //Objectives and VPs
            //check if Game is Over
        }
    
    
    
    
    
    
    
    
    
        PrintCard();
    } 

    const ResetActivations = (phase) => {
        _.each(UnitArray,unit => {
            let unitLeader = ModelArray[unit.modelIDs[0]];
            if (unitLeader) {
                if (phase === "Movement" && (unit.order === "Advance" || unit.order === "March" || unit.order === "Charge")) {
                    unitLeader.token.set("aura1_color",Colours.green);
                } else if (phase === "First Fire" && unit.order === "First Fire") {
                    unitLeader.token.set("aura1_color",Colours.green);
                } else if (phase === "Close Combat" && unit.order === "Charge") {
                    unitLeader.token.set("aura1_color",Colours.green);
                } else if (phase === "Advancing Fire" && unit.order === "Advance") {
                    unitLeader.token.set("aura1_color",Colours.green);
                } else {
                    unitLeader.token.set("aura1_color",Colours.black);
                }
            }
        });
    }


    const PlaceOrder = (msg) => {
        if (state.LI.phase !== "Orders") {
            sendChat("","Not Orders Phase");
            return;
        }
        if (!msg.selected) {
            sendChat("","Select a Model");
            return;
        }
        let Tag = msg.content.split(";");
        let id = msg.selected[0]._id;
        let playerID = msg.playerid;
        let playerObj = findObjs({type: 'player',id: playerID})[0];
        let who = playerObj.get("displayname");
        let order = Tag[1];
        let model = ModelArray[id];
        let unit = UnitArray[model.unitID];
        let unitLeader = ModelArray[unit.modelIDs[0]];
        if (unit.order === "Fall Back") {
            sendChat("System",`/w "${who}"` + "Unit is on Fall Back this turn");
            return;
        }


        unitLeader.token.set("aura1_color",Colours.black);
        unit.order = order;
        sendChat("System",`/w "${who}"` + order + " Given");
    }

    const Checks = (msg) => {
        let Tag = msg.content.split(";");
        let reason = Tag[1];
        if (reason === "Orders") {
            let unit = CheckArray.shift();
            if (unit) {
                let unitLeader = ModelArray[unit.modelIDs[0]];
                if (unitLeader) {
                    let location = unitLeader.location;
                    sendPing(location.x,location.y, Campaign().get('playerpageid'), null, true); 
                    SetupCard(unit.name,"Needs an Order",unit.faction);
                    unit.order = "Advance";
                    unitLeader.token.set("aura1_color",Colours.black);
                    outputCard.body.push("Give order then click Button in this window to advance when done");
                    outputCard.body.push("Otherwise Default will be Advance");
                    ButtonInfo("Order Given","!Checks;Orders");
                    PrintCard();
                } else {
                    Checks("Orders");
                }
            } else {
                NextPhase2("Orders");
            }
        }
        if (reason === "Morale") {
            let unit = CheckArray.shift();
            if (unit) {
                let unitLeader = ModelArray[unit.modelIDs[0]];
                if (unitLeader) {
                    let location = unitLeader.location;
                    sendPing(location.x,location.y, Campaign().get('playerpageid'), null, true); 
                    SetupCard(unit.name,"Morale Check",unit.faction);
                    outputCard.body.push("The Detachment must flee directly towards their side's table edge");
                    outputCard.body.push("If it moves off the table edge or ends up in an Enemy Detachment it is destroyed.");
                    outputCard.body.push("It moves " + (unitLeader.movement * 2) + '" and must maintain cohesion');
                    outputCard.body.push("When done, the Unit may take a Morale Check to rally");
                    ButtonInfo("Morale Check","!RollD6;Morale");                    
                    PrintCard();
                } else {
                    Checks("Morale");
                }
            } else {
                fallbackFlag = true;
                NextPhase2("End");
            }
        }
        if (reason === "Movement") {
            let unit = CheckArray.shift();
            if (unit) {
//check if unit has advance/march and didnt move

                let unitLeader = ModelArray[unit.modelIDs[0]];
                if (unitLeader) {
                    let location = unitLeader.location;
                    sendPing(location.x,location.y, Campaign().get('playerpageid'), null, true); 
                    



                    ButtonInfo("Next","!Checks;Morale");
                    PrintCard();
                } else {
                    Checks("Movement");
                }
            } else {
                NextPhase2("Movement");
            }





        }







    }

    const RevealOrders = () => {
        _.each(UnitArray,unit => {
            let ord = unit.order.toLowerCase();
            if (!ord) {ord = "advance"}
            let mark = SM[ord];
            for (let i=0;i<unit.modelIDs.length;i++) {
                let model = ModelArray[unit.modelIDs[i]];
                if (model) {
                    model.token.set(mark,true);
                    if (i === 0) {
                        model.token.set("aura1_color",Colours.green);
                    }
                }
            }
        });
    }

    const Test = (msg) => {
       return;
    }






    const changeGraphic = (tok,prev) => {
        if (tok.get('subtype') === "token") {
            RemoveLines();
            log(tok.get("name") + " moving");
            if ((tok.get("left") !== prev.left) || (tok.get("top") !== prev.top)) {
                let model = ModelArray[tok.id];
                if (!model) {return};
                let oldHex = model.hex;
                let oldHexLabel = model.hexLabel;
                
                let newLocation = new Point(tok.get("left"),tok.get("top"));
                let newHex = pointToHex(newLocation);
                let newHexLabel = newHex.label();
                newLocation = hexToPoint(newHex); //centres it in hex
                
                tok.set({
                    left: newLocation.x,
                    top: newLocation.y,
                });
                model.hex = newHex;
                model.hexLabel = newHexLabel;
                model.location = newLocation;
                let index = hexMap[oldHexLabel].tokenIDs.indexOf(tok.id);
                if (index > -1) {
                    hexMap[oldHexLabel].tokenIDs.splice(index,1);
                }
                hexMap[newHexLabel].tokenIDs.push(tok.id);
                if (model.large === "Large") {
                    model.vertices = TokenVertices(tok);
                    LargeTokens(model);
                }
            };
        };
    };



    const handleInput = (msg) => {
        if (msg.type !== "api") {
            return;
        }
        let args = msg.content.split(";");
        log(args);
        switch(args[0]) {
            case '!Dump':
                log("STATE");
                log(state.LI);
                log("Terrain Array");
                log(TerrainArray);
                log("Model Array");
                log(ModelArray);
                log("Unit Array");
                log(UnitArray)
                log("Formation Array");
                log(FormationArray);
                break;
            case '!ClearState':
                ClearState();
                break;
            case '!Roll':
                RollD6(msg);
                break;
            case '!UnitCreation':
                UnitCreation(msg);
                break;
            case '!UnitCreation2':
                UnitCreation2(msg);
                break;
            case '!TokenInfo':
                TokenInfo(msg);
                break;
            case '!CheckLOS':
                CheckLOS(msg);
                break;
            case '!AddAbilities':
                AddAbilities(msg);
                break;
            case '!RemoveLines':
                RemoveLines();
                break;
            case '!StartGame':
                StartGame();
                break;
            case '!NextPhase':
                NextPhase();
                break;
            case '!UserImage':
                UserImage(msg);
                break;
            case '!PlaceOrder':
                PlaceOrder(msg);
                break;
            case '!Checks':
                Checks(msg);
                break;
            case '!Test':
                Test(msg);
                break;
    
        }
    };
    const registerEventHandlers = () => {
        on('chat:message', handleInput);
        on('change:graphic',changeGraphic);
        on('destroy:graphic',destroyGraphic);
    };
    on('ready', () => {
        log("===> Legions Imperialis Rules: " + rules + " <===");
        log("===> Software Version: " + version + " <===");
        LoadPage();
        BuildMap();
        registerEventHandlers();
        sendChat("","API Ready, Map Loaded")
        log("On Ready Done")
    });
    return {
        // Public interface here
    };




})();