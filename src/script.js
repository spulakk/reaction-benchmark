let vReactionTimeAvg;
let aReactionTimeAvg;
let currentCycle;
let cycleCount;
let startTime;
let endTime;
let reactionTimeArray;

const VISUAL = 'visual';
const ACOUSTIC = 'acoustic';

$(document).on('click', '#startVisualBtn', function()
{
    initTest(VISUAL);
});

$(document).on('click', '#startAcousticBtn', function()
{
    initTest(ACOUSTIC);
});

$(document).on('click', '#testSoundBtn', function()
{
    $('#sound')[0].play();
});

$(document).on('click', '#resetBtn', function()
{
    location.reload();
});

function initTest(type)
{
    currentCycle = 0;
    cycleCount = 5;
    reactionTimeArray = [];

    $('#guide').hide();
    $('#timerDisplay').html('');

    startTest(type);
}

function startTest(type)
{
    let randomTime = Math.random() * 5000 + 3000; // Random time between 3 and 8 seconds

    setTimeout(function()
    {
        currentCycle++;

        startTime = new Date().getTime();

        if(type === VISUAL)
        {
            $('#timingBtn').removeClass('btn-secondary').addClass('btn-danger');
        }
        else if(type === ACOUSTIC)
        {
            $('#timingBtn').addClass('waiting');
            $('#sound')[0].play();
        }
    }, randomTime);

    $('#timingBtn').on('click', function()
    {
        if(readyCondition(type))
        {
            endTime = new Date().getTime();

            let reactionTime = endTime - startTime;
            reactionTimeArray.push(reactionTime);

            $('#timerDisplay').append('<div class="mb-1">Reaction time ' + currentCycle + ': ' + reactionTime + ' ms</div>');

            if(type === VISUAL)
            {
                $(this).removeClass('btn-danger').addClass('btn-secondary');
            }
            else if(type === ACOUSTIC)
            {
                $(this).removeClass('waiting');
            }

            if(currentCycle < cycleCount)
            {
                startTest(type);
            }
            else
            {
                showResult(type);
            }
        }
    });
}

function readyCondition(type)
{
    if(type === VISUAL)
    {
        return $('#timingBtn').hasClass('btn-danger');
    }
    else if(type === ACOUSTIC)
    {
        return $('#timingBtn').hasClass('waiting');
    }
}

function showResult(type)
{
    if(type === VISUAL)
    {
        vReactionTimeAvg = Math.round(reactionTimeArray.reduce((a, b) => (a + b)) / reactionTimeArray.length); // Sum divided by count

        $('#guide').html(
            '<p>Good job! Your average visual reaction time is ' + vReactionTimeAvg + ' ms. Now let\'s see about your acoustic reaction time.</p>' +
            '<p>After a brief period a sound will be played, but the button WILL NOT change color. Once you hear the sound, click the button.</p>' +
            '<p>You can test the sound to make sure you can hear it properly. The test will be run five times again.</p>' +
            '<p>Once you\'re ready, click the button below.</p>' +
            '<button id="startAcousticBtn" class="btn btn-primary mr-2">I\'m ready!</button>' +
            '<button id="testSoundBtn" class="btn btn-info ml-2">Test sound</button>'
        );
        $('#guide').show();
    }
    else if(type === ACOUSTIC)
    {
        aReactionTimeAvg = Math.round(reactionTimeArray.reduce((a, b) => (a + b)) / reactionTimeArray.length); // Sum divided by count

        $('#guide').html(
            '<p>Great! Let\'s take a look at the results:</p>' +
            '<div class="row"><div class="col-12 col-sm-6 mb-3"><div>Visual reaction time</div><div class="font-weight-bold">' + vReactionTimeAvg + ' ms</div></div>' +
            '<div class="col-12 col-sm-6 mb-4"><div>Acoustic reaction time</div><div class="font-weight-bold">' + aReactionTimeAvg + ' ms</div></div></div>'
        );

        if(Math.abs(vReactionTimeAvg - aReactionTimeAvg) < 10)
        {
            $('#guide').append(
                '<p>Your visual and acoustic reaction times are about the same.</p>' +
                '<p>This is good, as it doesn\'t matter what you\'re reacting to.</p>'
            );
        }
        else if(vReactionTimeAvg < aReactionTimeAvg)
        {
            $('#guide').append(
                '<p>Your visual reaction time is significantly faster.</p>' +
                '<p>In games, you should mostly rely on your sight. I would also recommend turning on sound visualization if possible.</p>'
            );
        }
        else
        {
            $('#guide').append(
                '<p>Your acoustic reaction time is significantly faster.</p>' +
                '<p>In games, you should mostly rely on your hearing. I would also recommend playing without music, which should help you focus better.</p>'
            );
        }

        $('#guide').append('<button id="resetBtn" class="btn btn-primary mr-2">Try again</button>');
        $('#guide').show();
    }
}