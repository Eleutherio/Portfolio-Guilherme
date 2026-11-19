import alecsandraKlattMartinsPhoto from "@/assets/testimonials/alecsandra-klatt-martins.jpg";
import alecsandraKlattMartinsAvif from "@/assets/testimonials/alecsandra-klatt-martins-96w.avif";
import alecsandraKlattMartinsWebp from "@/assets/testimonials/alecsandra-klatt-martins-96w.webp";
import alecsandraKlattMartins128Avif from "@/assets/testimonials/alecsandra-klatt-martins-128w.avif";
import alecsandraKlattMartins128Webp from "@/assets/testimonials/alecsandra-klatt-martins-128w.webp";
import alecsandraKlattMartins192Avif from "@/assets/testimonials/alecsandra-klatt-martins-192w.avif";
import alecsandraKlattMartins192Webp from "@/assets/testimonials/alecsandra-klatt-martins-192w.webp";
import brunaVizzottoPhoto from "@/assets/testimonials/bruna-vizzotto.jpg";
import brunaVizzottoAvif from "@/assets/testimonials/bruna-vizzotto-96w.avif";
import brunaVizzottoWebp from "@/assets/testimonials/bruna-vizzotto-96w.webp";
import brunaVizzotto128Avif from "@/assets/testimonials/bruna-vizzotto-128w.avif";
import brunaVizzotto128Webp from "@/assets/testimonials/bruna-vizzotto-128w.webp";
import brunaVizzotto192Avif from "@/assets/testimonials/bruna-vizzotto-192w.avif";
import brunaVizzotto192Webp from "@/assets/testimonials/bruna-vizzotto-192w.webp";
import leonardoAlvarezPereiraGomesPhoto from "@/assets/testimonials/leonardo-alvarez-pereira-gomes.jpg";
import leonardoAlvarezPereiraGomesAvif from "@/assets/testimonials/leonardo-alvarez-pereira-gomes-96w.avif";
import leonardoAlvarezPereiraGomesWebp from "@/assets/testimonials/leonardo-alvarez-pereira-gomes-96w.webp";
import leonardoAlvarezPereiraGomes128Avif from "@/assets/testimonials/leonardo-alvarez-pereira-gomes-128w.avif";
import leonardoAlvarezPereiraGomes128Webp from "@/assets/testimonials/leonardo-alvarez-pereira-gomes-128w.webp";
import leonardoAlvarezPereiraGomes192Avif from "@/assets/testimonials/leonardo-alvarez-pereira-gomes-192w.avif";
import leonardoAlvarezPereiraGomes192Webp from "@/assets/testimonials/leonardo-alvarez-pereira-gomes-192w.webp";
import marthaIzabelPhoto from "@/assets/testimonials/martha-izabel.jpg";
import marthaIzabelAvif from "@/assets/testimonials/martha-izabel-96w.avif";
import marthaIzabelWebp from "@/assets/testimonials/martha-izabel-96w.webp";
import marthaIzabel128Avif from "@/assets/testimonials/martha-izabel-128w.avif";
import marthaIzabel128Webp from "@/assets/testimonials/martha-izabel-128w.webp";
import marthaIzabel192Avif from "@/assets/testimonials/martha-izabel-192w.avif";
import marthaIzabel192Webp from "@/assets/testimonials/martha-izabel-192w.webp";
import tainaraConradBassaniPhoto from "@/assets/testimonials/tainara-conrad-bassani.jpg";
import tainaraConradBassaniAvif from "@/assets/testimonials/tainara-conrad-bassani-96w.avif";
import tainaraConradBassaniWebp from "@/assets/testimonials/tainara-conrad-bassani-96w.webp";
import tainaraConradBassani128Avif from "@/assets/testimonials/tainara-conrad-bassani-128w.avif";
import tainaraConradBassani128Webp from "@/assets/testimonials/tainara-conrad-bassani-128w.webp";
import tainaraConradBassani192Avif from "@/assets/testimonials/tainara-conrad-bassani-192w.avif";
import tainaraConradBassani192Webp from "@/assets/testimonials/tainara-conrad-bassani-192w.webp";

type LocalizedText = {
  pt: string;
  en: string;
};

type LocalizedDate = LocalizedText & {
  iso: string;
};

type Testimonial = {
  id: string;
  name: string;
  role?: LocalizedText;
  company: string;
  linkedinUrl: string;
  date?: LocalizedDate;
  sourceNote?: LocalizedText;
  quote: LocalizedText;
  image: {
    avif: string;
    webp: string;
    fallback: string;
  };
};

const responsiveSources = (source96: string, source128: string, source192: string) =>
  `${source96} 96w, ${source128} 128w, ${source192} 192w`;

// Curadoria normalizada de recomendações do LinkedIn e feedbacks exportados do Feedz.
export const testimonials: Testimonial[] = [
  {
    id: "bruna-vizzotto",
    name: "Bruna Vizzotto",
    role: {
      pt: "Estagiária em desenvolvimento de software",
      en: "Software development intern",
    },
    company: "ADP Brazil Labs",
    linkedinUrl: "https://www.linkedin.com/in/brunavizzotto/",
    image: {
      avif: responsiveSources(brunaVizzottoAvif, brunaVizzotto128Avif, brunaVizzotto192Avif),
      webp: responsiveSources(brunaVizzottoWebp, brunaVizzotto128Webp, brunaVizzotto192Webp),
      fallback: brunaVizzottoPhoto,
    },
    quote: {
      pt: "Tivemos a oportunidade de atuar juntos em um projeto de tecnologia para a Grendene, por meio da Unisinos, e a contribuição dele foi fundamental para o avanço da equipe. O Guilherme possui uma postura profissional admirável, unindo pensamento analítico com uma execução extremamente organizada. Ele teve um papel crucial na estruturação do nosso fluxo de trabalho, facilitando o andamento das demandas e o alinhamento de todo o time. Além disso, sua proatividade chamou muita atenção no dia a dia: ele constantemente se antecipava aos desafios técnicos e propunha melhorias e nas regras de negócio antes mesmo que se tornassem bloqueios. Ele compreende profundamente a dinâmica de projetos de desenvolvimento colaborativo e tem uma ótima comunicação. Qualquer empresa ou equipe que busque um profissional engajado, colaborativo e focado em entregas de alto nível terá muita sorte em contar com ele.",
      en: "We had the opportunity to work together on a technology project for Grendene through Unisinos, and his contribution was essential to the team’s progress. Guilherme has an admirable professional attitude, combining analytical thinking with highly organized execution. He played a crucial role in structuring our workflow, helping requests move forward and keeping the whole team aligned. His proactive approach also stood out in our daily work: he consistently anticipated technical challenges and proposed improvements to business rules before they became blockers. He has a deep understanding of collaborative development projects and communicates very well. Any company or team looking for an engaged, collaborative professional focused on high-quality delivery would be very fortunate to have him.",
    },
  },
  {
    id: "leonardo-alvarez-pereira-gomes-2026-08-21",
    name: "Leonardo Alvarez Pereira Gomes",
    role: {
      pt: "Especialista de tecnologia da informação",
      en: "Information technology specialist",
    },
    company: "Sistema Ocergs",
    linkedinUrl: "https://www.linkedin.com/in/lapgomes/",
    date: {
      iso: "2026-08-21",
      pt: "21/08/2026",
      en: "August 21, 2026",
    },
    sourceNote: {
      pt: "Feedback fornecido pela plataforma Feedz.",
      en: "Feedback provided via the Feedz platform.",
    },
    image: {
      avif: responsiveSources(
        leonardoAlvarezPereiraGomesAvif,
        leonardoAlvarezPereiraGomes128Avif,
        leonardoAlvarezPereiraGomes192Avif,
      ),
      webp: responsiveSources(
        leonardoAlvarezPereiraGomesWebp,
        leonardoAlvarezPereiraGomes128Webp,
        leonardoAlvarezPereiraGomes192Webp,
      ),
      fallback: leonardoAlvarezPereiraGomesPhoto,
    },
    quote: {
      pt: "Tens demonstrado comprometimento com as atividades do dia a dia, boa disposição para aprender e relacionamento positivo com a equipe e colaboradores. Tem atendido os usuários com cordialidade e busca soluções para os chamados com dedicação. Continue assim!!",
      en: "You have shown commitment to your day-to-day responsibilities, a strong willingness to learn, and a positive relationship with the team and other colleagues. You assist users courteously and work diligently to find solutions for their support requests. Keep it up!",
    },
  },
  {
    id: "leonardo-alvarez-pereira-gomes-2026-07-17",
    name: "Leonardo Alvarez Pereira Gomes",
    role: {
      pt: "Especialista de tecnologia da informação",
      en: "Information technology specialist",
    },
    company: "Sistema Ocergs",
    linkedinUrl: "https://www.linkedin.com/in/lapgomes/",
    date: {
      iso: "2026-07-17",
      pt: "17/07/2026",
      en: "July 17, 2026",
    },
    sourceNote: {
      pt: "Feedback fornecido pela plataforma Feedz.",
      en: "Feedback provided via the Feedz platform.",
    },
    image: {
      avif: responsiveSources(
        leonardoAlvarezPereiraGomesAvif,
        leonardoAlvarezPereiraGomes128Avif,
        leonardoAlvarezPereiraGomes192Avif,
      ),
      webp: responsiveSources(
        leonardoAlvarezPereiraGomesWebp,
        leonardoAlvarezPereiraGomes128Webp,
        leonardoAlvarezPereiraGomes192Webp,
      ),
      fallback: leonardoAlvarezPereiraGomesPhoto,
    },
    quote: {
      pt: "Gostaria de registrar meu reconhecimento pelo desempenho apresentado durante este período inicial de atuação no estágio na equipe de TI. Tem demonstrado uma postura muito prestativa, mantendo-se disponível para auxiliar nas demandas e buscando atender os usuários com cordialidade e atenção. Destaca-se também pelo interesse constante em aprender, absorvendo novos conhecimentos e procurando compreender os processos, ferramentas e procedimentos adotados pela área. Outro ponto positivo é sua preocupação em seguir os padrões e boas práticas estabelecidos pelo Sistema Ocergs, demonstrando comprometimento com a qualidade das entregas e com a forma de trabalho da instituição. Continue mantendo essa dedicação, proatividade e vontade de evoluir. Essas características certamente contribuirão para seu desenvolvimento profissional e para o sucesso das atividades da equipe. Parabéns pelo trabalho realizado até o momento! 👏 💻 🚀",
      en: "I would like to recognize your performance during this initial period as an intern on the IT team. You have been very helpful, remaining available to assist with requests and serving users with courtesy and care. Your consistent interest in learning also stands out: you absorb new knowledge and seek to understand the processes, tools, and procedures used by the department. Another positive aspect is your commitment to following the standards and good practices established by Sistema Ocergs, demonstrating care for the quality of your work and the institution’s way of operating. Keep showing this dedication, initiative, and desire to grow. These qualities will certainly contribute to your professional development and to the success of the team’s work. Congratulations on everything you have accomplished so far! 👏 💻 🚀",
    },
  },
  {
    id: "martha-izabel-di-franco-machado",
    name: "Martha Izabel Di Franco Machado",
    role: {
      pt: "Estrategista de conteúdo e gestora de comunidade",
      en: "Content strategist & community manager",
    },
    company: "Bistrô",
    linkedinUrl: "https://www.linkedin.com/in/marthaizabel/",
    image: {
      avif: responsiveSources(marthaIzabelAvif, marthaIzabel128Avif, marthaIzabel192Avif),
      webp: responsiveSources(marthaIzabelWebp, marthaIzabel128Webp, marthaIzabel192Webp),
      fallback: marthaIzabelPhoto,
    },
    quote: {
      pt: "Quando voluntariou para a ADEVIC, onde eu era assessora de comunicação na época, o Guilherme entregou um trabalho consistente e estruturado. Com seu olhar criativo e técnico, promoveu melhorias que fizeram e fazem a diferença para a associação até hoje.",
      en: "When Guilherme volunteered at ADEVIC, where I was the communications advisor at the time, he delivered consistent, well-structured work. With his creative and technical perspective, he introduced improvements that made—and continue to make—a difference for the association.",
    },
  },
  {
    id: "alecsandra-klatt-martins",
    name: "Alecsandra Klatt Martins",
    role: {
      pt: "Analista de operações",
      en: "Operations analyst",
    },
    company: "BEM Promotora",
    linkedinUrl:
      "https://www.linkedin.com/in/alecsandra-klatt-martins-comunica%C3%A7%C3%A3o-com-inten%C3%A7%C3%A3o-407b43159/",
    image: {
      avif: responsiveSources(
        alecsandraKlattMartinsAvif,
        alecsandraKlattMartins128Avif,
        alecsandraKlattMartins192Avif,
      ),
      webp: responsiveSources(
        alecsandraKlattMartinsWebp,
        alecsandraKlattMartins128Webp,
        alecsandraKlattMartins192Webp,
      ),
      fallback: alecsandraKlattMartinsPhoto,
    },
    quote: {
      pt: "Eu recomendo Guilherme pois ele e muito centrado efetua de forma eficaz e cautelosa suas tarefas tem conhecimentos administrativos e pro ativo e trabalha muito bem em equipe. E tem um ótimo raciocínio e uma boa memoria.",
      en: "I recommend Guilherme because he is highly focused and carries out his tasks effectively and carefully. He has administrative knowledge, takes initiative, and works very well as part of a team. He also has excellent reasoning skills and a strong memory.",
    },
  },
  {
    id: "tainara-conrad-bassani",
    name: "Tainara Conrad Bassani",
    role: {
      pt: "Jovem aprendiz",
      en: "Young apprentice",
    },
    company: "SENAC Brasil",
    linkedinUrl: "https://www.linkedin.com/in/tainara-conrad-bassani/",
    image: {
      avif: responsiveSources(
        tainaraConradBassaniAvif,
        tainaraConradBassani128Avif,
        tainaraConradBassani192Avif,
      ),
      webp: responsiveSources(
        tainaraConradBassaniWebp,
        tainaraConradBassani128Webp,
        tainaraConradBassani192Webp,
      ),
      fallback: tainaraConradBassaniPhoto,
    },
    quote: {
      pt: "Guilherme é um jovem cheio de ideias, focado e que fornece toda ajuda que você precisar. Sempre comprometido com todas as tarefas, as quais conseguia terminar com êxito mesmo sob pressão constante. Sabe interagir, tem um bom relacionamento com todos os colegas, além de ser responsável e dedicado.",
      en: "Guilherme is a focused young professional full of ideas who is always willing to provide whatever help you need. He remained committed to every task and completed them successfully even under constant pressure. He interacts well with others, maintains positive relationships with all his colleagues, and is both responsible and dedicated.",
    },
  },
];
