import { useState } from 'react';

const QUESTIONS = [
  {
    q: 'Which element is added to neodymium magnets so they keep working at engine temperatures?',
    options: ['Dysprosium', 'Helium', 'Carbon', 'Silicon'],
    answer: 'Dysprosium',
  },
  {
    q: "Which country processes the large majority of the world's rare earths today?",
    options: ['Brazil', 'China', 'Australia', 'Canada'],
    answer: 'China',
  },
  {
    q: 'Niobium is mainly added to steel to make it…',
    options: ['Shinier', 'Stronger without extra weight', 'Magnetic', 'Cheaper to mine'],
    answer: 'Stronger without extra weight',
  },
  {
    q: "Lithium's largest use today is in…",
    options: ['Sunscreen', 'Fertilizer', 'EV and grid batteries', 'Jewelry'],
    answer: 'EV and grid batteries',
  },
  {
    q: 'Which of these is NOT a rare earth element?',
    options: ['Neodymium', 'Terbium', 'Lithium', 'Dysprosium'],
    answer: 'Lithium',
  },
];

export default function QuizCard() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const current = QUESTIONS[index];

  function choose(option) {
    if (selected) return;
    setSelected(option);
    if (option === current.answer) setScore((s) => s + 1);
  }

  function next() {
    setSelected(null);
    setIndex((i) => (i + 1) % QUESTIONS.length);
  }

  return (
    <section className="section">
      <div className="card quiz-card">
        <div className="quiz-head">
          <span className="eyebrow">Critical Minerals IQ</span>
          <span className="status-line">
            Score: {score}/{index + (selected ? 1 : 0)}
          </span>
        </div>
        <p className="quiz-question">{current.q}</p>
        <div className="quiz-options">
          {current.options.map((opt) => {
            let cls = 'quiz-option';
            if (selected) {
              if (opt === current.answer) cls += ' correct';
              else if (opt === selected) cls += ' incorrect';
            }
            return (
              <button key={opt} type="button" className={cls} onClick={() => choose(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
        {selected && (
          <button type="button" className="sim-reset quiz-next" onClick={next}>
            Next question →
          </button>
        )}
      </div>
    </section>
  );
}
