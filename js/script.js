$(document).ready(function() {
    let textToCopy = '';
    let currentIndex = 0;
    let currentIDIndex = 1;
    let capsLockActive = false;
    let startTime = Date.now();
    let activity; // Variável para armazenar os dados do arquivo JSON
    let letters = []; // Variável para armazenar as letras permitidas
    var nameJson = $('#activity').val();

    function updateProgress(data) {
        // Encontrar o maior ID presente no array activity1.json
        let maxID = 0;
        data.questions.forEach(item => {
            if (item.id > maxID) {
                maxID = item.id;
            }
        });

        // Calcular o progresso
        const progress = (currentIDIndex / maxID) * 100;
        $('#progress').text(`Progresso: ${progress.toFixed(2)}%`);
    }

    function updateTime() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        $('#timer').text(`Tempo: ${formattedTime}`);
    }

    // Função para verificar se o Caps Lock está ativado
    function checkCapsLock() {
        if (event.getModifierState("CapsLock")) {
            capsLockActive = true;
            $('#caps-lock').css('background-color', 'orange');
        } else {
            capsLockActive = false;
            $('#caps-lock').css('background-color', '');
        }
    }

    function getInputValue() {
        const expectedChar = textToCopy[currentIndex];
        $('#' + expectedChar.toLowerCase()).css('background-color', 'green');
        if (expectedChar == expectedChar.toUpperCase()) {
            $('#left-shift').css('background-color', 'green');
        }
    }

    function getQuestion() {
        $.getJSON('./activities/'+ nameJson +'.json', function(data) {
            activity = data.questions; // Atribuir os dados das questões à variável activity
            letters = data.letters; // Atribuir as letras permitidas à variável letters
            $('#title').text(data.title); // Definir o título da atividade
            populateAlphabetKeys(letters); // Adicionar as letras permitidas ao HTML
            const currentActivity = activity.find(item => item.id === currentIDIndex);
            if (currentActivity) {
                textToCopy = currentActivity.description;
                $('#textToCopy input').val(textToCopy).attr('readonly', true);
                getInputValue();
                currentIndex = 0; // Reinicia o índice para a próxima questão
                $('#workText').val('').focus(); // Limpa e foca na área de trabalho
                updateTime(); // Atualizar o tempo
                updateProgress(data); // Atualizar o progresso com os dados do arquivo JSON
            }
        });
    }

    function populateAlphabetKeys(letters) {
        const alphabetKeysContainer = $('#alphabet-keys');
        alphabetKeysContainer.empty(); // Limpa o container
        letters.forEach(letter => {
            const keyElement = `<div class="key" class="${letter}">${letter.toUpperCase()}${letter.toLowerCase()}</div>`;
            alphabetKeysContainer.append(keyElement);
        });
    }

    function updateKeyHighlight() {
        const currentChar = textToCopy[currentIndex];
        const keyElement = getKeyElement(currentChar);
        $('.key').css('background-color', '');
        if (keyElement) {
            keyElement.css('background-color', 'green');
        }
    }

    function getKeyElement(char) {
        switch (char) {
            case ' ':
                return $('#space');
            case '!':
                return $('#1');
            case '@':
                return $('#2');
            case '#':
                return $('#3');
            case '$':
                return $('#4');
            case '%':
                return $('#5');
            case '¨':
                return $('#6');
            case '&':
                return $('#7');
            case '*':
                return $('#8');
            case '(':
                return $('#9');
            case ')':
                return $('#0');
            case '-':
                return $('#minus');
            case '=':
                return $('#equal');
            case '{':
                return $('#open-bracket');
            case '}':
                return $('#close-bracket');
            case '\\':
                return $('#backslash');
            case ':':
                return $('#semicolon');
            case '\'':
                return $('#quote');
            case '<':
                return $('#comma');
            case '>':
                return $('#period');
            case '?':
                return $('#slash');
            default:
                return $('#' + char.toLowerCase());
        }
    }

    $('#workText').on('input', function() {
        const typedText = $(this).val();
        const expectedChar = textToCopy[currentIndex];

        if (typedText[currentIndex] === expectedChar) {
            currentIndex++;
            if (currentIndex === textToCopy.length) {
                currentIDIndex += 1;
                currentIndex = 0;
                $('#title').text('Atividade ' + currentIDIndex);
                $('.key').css('background-color', '');
                getQuestion();
            } else {
                updateKeyHighlight();
            }
        } else {
            $(this).val(typedText.slice(0, -1));
            const keyElement = getKeyElement(typedText[currentIndex]);
            if (keyElement) {
                keyElement.css('background-color', 'red');
            }
        }
    });

    // Evento para verificar o estado do Caps Lock ao pressionar uma tecla
    $(window).on('keydown', function(e) {
        if (e.originalEvent.key && e.originalEvent.key.match(/[a-z]/i)) {
            checkCapsLock();
        } // Verifica se a tecla pressionada é a tecla Backspace
        if (e.keyCode === 8) {
            // Impede o comportamento padrão da tecla Backspace
            e.preventDefault();
        }
    });

    getQuestion();
    setInterval(updateTime, 1000); // Chama a função updateTime a cada segundo
});
