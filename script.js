document.addEventListener('DOMContentLoaded', function() {
    // Quiz data with enhanced content
    const quizData = [
        {
            id: 1,
            question: "What is the capital of France?",
            image: "https://picsum.photos/seed/paris/800/400.jpg",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: 2,
            hint: "This city is known as the 'City of Light' and home to the Eiffel Tower."
        },
        {
            id: 2,
            question: "Which planet is known as the Red Planet?",
            image: "https://picsum.photos/seed/mars/800/400.jpg",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 1,
            hint: "It's named after the Roman god of war and has the largest volcano in the solar system."
        },
        {
            id: 3,
            question: "What is the largest ocean on Earth?",
            image: "https://picsum.photos/seed/ocean/800/400.jpg",
            options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
            correctAnswer: 3,
            hint: "It covers more than 30% of Earth's surface and contains the Mariana Trench."
        },
        {
            id: 4,
            question: "Who painted the Mona Lisa?",
            image: "https://picsum.photos/seed/monalisa/800/400.jpg",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            correctAnswer: 2,
            hint: "This Renaissance artist was also an inventor and scientist who designed flying machines."
        },
        {
            id: 5,
            question: "What is the smallest country in the world?",
            image: "https://picsum.photos/seed/vatican/800/400.jpg",
            options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
            correctAnswer: 2,
            hint: "It's located within Rome, Italy and is the headquarters of the Roman Catholic Church."
        }
    ];

    // Quiz state
    let currentQuestion = 0;
    let userAnswers = [];
    let timer;
    let timeLeft = 30;
    let quizCompleted = false;
    let startTime;
    let totalTime = 0;
    let highScore = localStorage.getItem('quizHighScore') || 0;
    let streak = 0;

    // DOM elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizContent = document.getElementById('quiz-content');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const hintBtn = document.getElementById('hint-btn');
    const hintContainer = document.getElementById('hint-container');
    const hintText = document.getElementById('hint-text');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const progressFill = document.getElementById('progress-fill');
    const timerSpan = document.getElementById('timer');
    const timerProgress = document.querySelector('.timer-progress');
    const restartBtn = document.getElementById('restart-btn');
    const shareBtn = document.getElementById('share-btn');
    const highScoreSpan = document.getElementById('high-score');
    const streakSpan = document.getElementById('streak');

    // Initialize high score display
    highScoreSpan.textContent = highScore;
    streakSpan.textContent = streak;

    // Event listeners
    startQuizBtn.addEventListener('click', startQuiz);
    prevBtn.addEventListener('click', goToPreviousQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
    submitBtn.addEventListener('click', submitQuiz);
    hintBtn.addEventListener('click', showHint);
    restartBtn.addEventListener('click', restartQuiz);
    shareBtn.addEventListener('click', shareResults);

    // Start quiz
    function startQuiz() {
        welcomeScreen.classList.remove('active');
        quizScreen.classList.add('active');
        startTime = Date.now();
        initQuiz();
    }

    // Initialize quiz
    function initQuiz() {
        totalQuestionsSpan.textContent = quizData.length;
        renderQuestion();
        updateProgress();
        startTimer();
        updateProgressDots();
    }

    // Render current question
    function renderQuestion() {
        const question = quizData[currentQuestion];
        
        // Clear previous content
        quizContent.innerHTML = '';
        
        // Create question container
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container active';
        
        // Create question header
        const questionHeader = document.createElement('div');
        questionHeader.className = 'question-header';
        
        const questionNumber = document.createElement('div');
        questionNumber.className = 'question-number';
        questionNumber.textContent = currentQuestion + 1;
        
        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = question.question;
        
        questionHeader.appendChild(questionNumber);
        questionHeader.appendChild(questionText);
        questionContainer.appendChild(questionHeader);
        
        // Add question image if available
        if (question.image) {
            const questionImage = document.createElement('img');
            questionImage.className = 'question-image';
            questionImage.src = question.image;
            questionImage.alt = `Image for question ${currentQuestion + 1}`;
            questionContainer.appendChild(questionImage);
        }
        
        // Create answers container
        const answersContainer = document.createElement('div');
        answersContainer.className = 'answers-container';
        
        // Create answer options
        question.options.forEach((option, index) => {
            const answerOption = document.createElement('div');
            answerOption.className = 'answer-option';
            
            // Check if this answer was previously selected
            if (userAnswers[currentQuestion] === index) {
                answerOption.classList.add('selected');
            }
            
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.id = `answer-${index}`;
            radioInput.name = 'answer';
            radioInput.value = index;
            radioInput.checked = userAnswers[currentQuestion] === index;
            
            const label = document.createElement('label');
            label.htmlFor = `answer-${index}`;
            label.textContent = option;
            
            answerOption.appendChild(radioInput);
            answerOption.appendChild(label);
            
            // Add click event to the whole option
            answerOption.addEventListener('click', function() {
                selectAnswer(index);
            });
            
            answersContainer.appendChild(answerOption);
        });
        
        questionContainer.appendChild(answersContainer);
        quizContent.appendChild(questionContainer);
        
        // Update navigation buttons
        updateNavigationButtons();
        
        // Hide hint
        hintContainer.classList.remove('show');
        
        // Update current question display
        currentQuestionSpan.textContent = currentQuestion + 1;
    }

    // Select an answer
    function selectAnswer(index) {
        userAnswers[currentQuestion] = index;
        
        // Update UI with animation
        const answerOptions = document.querySelectorAll('.answer-option');
        answerOptions.forEach((option, i) => {
            if (i === index) {
                option.classList.add('selected');
                option.querySelector('input').checked = true;
                // Add pulse animation
                option.classList.add('pulse');
                setTimeout(() => option.classList.remove('pulse'), 1000);
            } else {
                option.classList.remove('selected');
                option.querySelector('input').checked = false;
            }
        });
    }

    // Navigate to previous question
    function goToPreviousQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion();
            updateProgress();
            updateProgressDots();
            resetTimer();
        }
    }

    // Navigate to next question
    function goToNextQuestion() {
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            renderQuestion();
            updateProgress();
            updateProgressDots();
            resetTimer();
        }
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        prevBtn.disabled = currentQuestion === 0;
        
        if (currentQuestion === quizData.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
        } else {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
        }
    }

    // Update progress bar
    function updateProgress() {
        const progress = ((currentQuestion + 1) / quizData.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    // Update progress dots
    function updateProgressDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index <= currentQuestion) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Timer functions
    function startTimer() {
        timeLeft = 30;
        updateTimerDisplay();
        
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                // Auto-advance to next question if time runs out
                if (currentQuestion < quizData.length - 1) {
                    goToNextQuestion();
                } else {
                    submitQuiz();
                }
            }
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timer);
        startTimer();
    }

    function updateTimerDisplay() {
        timerSpan.textContent = timeLeft;
        
        // Update circular progress
        const circumference = 2 * Math.PI * 28;
        const offset = circumference - (timeLeft / 30) * circumference;
        timerProgress.style.strokeDashoffset = offset;
        
        // Change color when time is running out
        if (timeLeft <= 10) {
            timerProgress.style.stroke = 'var(--danger-color)';
            timerSpan.style.color = 'var(--danger-color)';
        } else if (timeLeft <= 20) {
            timerProgress.style.stroke = 'var(--warning-color)';
            timerSpan.style.color = 'var(--warning-color)';
        } else {
            timerProgress.style.stroke = 'var(--primary-color)';
            timerSpan.style.color = 'var(--primary-color)';
        }
    }

    // Show hint
    function showHint() {
        hintText.textContent = quizData[currentQuestion].hint;
        hintContainer.classList.add('show');
    }

    // Submit quiz
    function submitQuiz() {
        clearInterval(timer);
        quizCompleted = true;
        totalTime = Math.floor((Date.now() - startTime) / 1000);
        
        // Calculate score
        let score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === quizData[index].correctAnswer) {
                score++;
            }
        });
        
        // Calculate percentage
        const percentage = Math.round((score / quizData.length) * 100);
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('quizHighScore', highScore);
            highScoreSpan.textContent = highScore;
        }
        
        // Update streak
        if (percentage >= 80) {
            streak++;
            streakSpan.textContent = streak;
        } else {
            streak = 0;
            streakSpan.textContent = streak;
        }
        
        // Display results
        displayResults(score, percentage);
    }

    // Display results
    function displayResults(score, percentage) {
        quizScreen.classList.remove('active');
        resultsScreen.classList.add('active');
        
        // Update score display
        document.getElementById('score-percentage').textContent = `${percentage}%`;
        document.getElementById('score-value').textContent = score;
        document.getElementById('total-score').textContent = quizData.length;
        
        // Draw score circle
        drawScoreCircle(percentage);
        
        // Update performance badge
        const badgeText = document.getElementById('badge-text');
        const badge = document.getElementById('performance-badge');
        
        if (percentage === 100) {
            badgeText.textContent = 'Perfect Score!';
            badge.style.background = 'var(--primary-gradient)';
        } else if (percentage >= 80) {
            badgeText.textContent = 'Excellent!';
            badge.style.background = 'var(--success-gradient)';
        } else if (percentage >= 60) {
            badgeText.textContent = 'Good Job!';
            badge.style.background = 'var(--warning-gradient)';
        } else {
            badgeText.textContent = 'Keep Practicing!';
            badge.style.background = 'var(--danger-gradient)';
        }
        
        // Update stats
        document.getElementById('correct-count').textContent = score;
        document.getElementById('incorrect-count').textContent = quizData.length - score;
        
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        document.getElementById('time-taken').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Show answer review
        showAnswerReview();
    }

    // Draw score circle
    function drawScoreCircle(percentage) {
        const canvas = document.getElementById('score-canvas');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 20;
        ctx.stroke();
        
        // Draw progress arc
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (2 * Math.PI * percentage / 100);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    // Show answer review
    function showAnswerReview() {
        const reviewContainer = document.getElementById('review-container');
        reviewContainer.innerHTML = '';
        
        quizData.forEach((question, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            const isCorrect = userAnswers[index] === question.correctAnswer;
            reviewItem.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            const reviewIcon = document.createElement('i');
            reviewIcon.className = `review-icon fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}`;
            
            const reviewContent = document.createElement('div');
            reviewContent.className = 'review-content';
            
            const reviewQuestion = document.createElement('div');
            reviewQuestion.className = 'review-question';
            reviewQuestion.textContent = `Q${index + 1}: ${question.question}`;
            
            const reviewAnswer = document.createElement('div');
            reviewAnswer.className = 'review-answer';
            
            if (userAnswers[index] !== undefined) {
                reviewAnswer.textContent = `Your answer: ${question.options[userAnswers[index]]}`;
            } else {
                reviewAnswer.textContent = "You didn't answer this question.";
            }
            
            if (!isCorrect) {
                const correctAnswer = document.createElement('div');
                correctAnswer.className = 'correct-answer';
                correctAnswer.textContent = `Correct: ${question.options[question.correctAnswer]}`;
                reviewContent.appendChild(correctAnswer);
            }
            
            reviewContent.appendChild(reviewQuestion);
            reviewContent.appendChild(reviewAnswer);
            
            reviewItem.appendChild(reviewIcon);
            reviewItem.appendChild(reviewContent);
            reviewContainer.appendChild(reviewItem);
        });
    }

    // Restart quiz
    function restartQuiz() {
        currentQuestion = 0;
        userAnswers = [];
        quizCompleted = false;
        totalTime = 0;
        
        resultsScreen.classList.remove('active');
        welcomeScreen.classList.add('active');
    }

    // Share results
    function shareResults() {
        const score = document.getElementById('score-value').textContent;
        const total = document.getElementById('total-score').textContent;
        const percentage = document.getElementById('score-percentage').textContent;
        
        const shareText = `I just scored ${score}/${total} (${percentage}) on QuizMaster Pro! Can you beat my score?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'QuizMaster Pro Results',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Results copied to clipboard!');
            });
        }
    }
});