const NextPhase = () => {
    let phase = state.LI.phase;
    //checks to see if unordered guys or whatever
    if (phase === "Orders") {

    } else if (phase === "Movement") {

    } else if (phase === "Combat") {


    } else if (phase === "End") {


        //Reset any Flags, advance Turn
    } 
    NextPhase2(phase);
}

const NextPhase2 = (phase) => {
    //all req to advance cleared
    let turn = state.LI.turn;
    let phases = ["Orders","Initiative","Movement","Combat","End"];
    let phaseNum = ((phases.indexOf(phase) + 1) > 3) ? 0:(phases.indexOf(phase) + 1);
    phase = phases[phaseNum];
    SetupCard(phase + " Phase","Turn: " + turn,"Neutral");

    if (phase === "Orders") {
        outputCard.body.push("Issue Orders to each Detachment");
        outputCard.body.push("Including Reserves and Transported Troops");
        outputCard.body.push("Excluding Detachments with Fall Back");
    } else if (phase === "Initiative") {
        //RevealOrders()
        outputCard.body.push("Players roll for Initiative");
        if (turn === 1) {
            outputCard.body.push("In case of a Tie Reroll");
        } else {
            outputCard.body.push("In case of Tie player who didn't have Initiative last turn has it this Turn");
        }
        outputCard.body.push("Player who wins Roll determines who has Initiative and goes First");
    } else if (phase === "Movement") {
        outputCard.body.push("Starting with Player with Initiative, take turns moving Detachments");
        outputCard.body.push("Detachments on First Fire can only be activated to Overwatch Fire");
        outputCard.body.push("Reserves arriving on Battlefield (e.g. Flyers, Deep Strikes etc.) can be activated normally");
        outputCard.body.push("Reserves remaining offtable cannot be activated until end");
    } else if (phase === "Combat") {
        outputCard.body.push("Combat is 3 stages:");
        outputCard.body.push("First Fire Stage");
        outputCard.body.push("Close Combat Stage");
        outputCard.body.push("Advancing Fire Stage");
    } else if (phase === "End") {
        //see if any detachments have Fall Back
        //if so
        //ButtonInfo("Start Morale Checks","!FallBackMorale");
        //else
        //End phase things?
        outputCard.body.push("Remove Flyers");
        //Objectives and VPs
        //check if Game is Over
    }









    PrintCard();
} 