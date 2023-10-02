var answers = {};
var questionNumber = 0;
var passedTest = false;

$(document).ready(function() {
    $("#start-btn").click(function(){
        $("#start").hide();
        $("#questions").show();
        setUpQuestion();
    });

    $(document).on("click", ".q-answer", function(e) {
        let answered = $(this).data("answer");
        let number = $(this).parent().data("number");
        handleAnswer({answered: answered, number: number});
    });

    $(document).on("keydown", function(e) {
        if (e.key == "Escape") { $.post(`https://${GetParentResourceName()}/close`, JSON.stringify(passedTest)); }
    });
});

function setUpQuestion() {
    let questionNow = questions[questionNumber];
    let html = `
        <span id="q-title">Fråga ${questionNumber + 1}</span>
        <div id="q-question">
            <span>${questionNow.question}</span>
        </div>
        <div data-number="${questionNumber}" id="q-answers">
            <div data-answer="A" class="q-answer"><p>A</p><span>${questionNow.propositionA}</span></div>
            <div data-answer="B" class="q-answer"><p>B</p><span>${questionNow.propositionB}</span></div>
            <div data-answer="C" class="q-answer"><p>C</p><span>${questionNow.propositionC}</span></div>
            <div data-answer="D" class="q-answer"><p>D</p><span>${questionNow.propositionD}</span></div>
        </div>
    `;
    $("#questions-parent").html(html);

    $("#q-fill").animate({width: `${questionNumber / questions.length * 100}%`}, 200)

    questionNumber++;
}

function handleAnswer(data) {
    let gotAnswerRight = data.answered == questions[data.number].reponse ? true : false;
    answers[data.number] = { question: questions[data.number].question, passed: gotAnswerRight, answered: data.answered, rightAnswer: questions[data.number].reponse };

    if (data.number + 1 < questions.length) {
        setUpQuestion();
    } else {
        setUpResults();
        $("#questions").hide();
        $("#results").show();
    }
}

function setUpResults() {
    let amountOfRights = 0;
    $.each(answers, (k, v) => {
        v.passed ? amountOfRights++ : null;
        let html = `
        <div class="results-block ${v.passed ? 'passed' : 'notpassed'}">
            <div class="results-qn">Fråga <span>${parseInt(k) + 1}</span></div>
            <div class="results-q">${v.question}</div>
            <div class="results-you">Rätt svar: <span>${v.rightAnswer}</span></div>
            <div class="results-right">Du svarade: <span>${v.answered}</span></div>
        </div>  
        `;
        $("#results-parent").append(html)
    });

    $("#results-percent").html(`${(amountOfRights / questions.length) * 100}%`);
    amountOfRights / questions.length >= 0.7 ? passedTest = true : passedTest = false;
    passedTest ? $("#results-title").html("Godkänt") : $("#results-title").html("Underkänt");
}