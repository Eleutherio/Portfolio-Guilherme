import alecsandraKlattMartinsPhoto from "@/assets/testimonials/alecsandra-klatt-martins.jpg";
import alecsandraKlattMartinsAvif from "@/assets/testimonials/alecsandra-klatt-martins-96w.avif";
import alecsandraKlattMartinsWebp from "@/assets/testimonials/alecsandra-klatt-martins-96w.webp";
import brunaVizzottoPhoto from "@/assets/testimonials/bruna-vizzotto.jpg";
import brunaVizzottoAvif from "@/assets/testimonials/bruna-vizzotto-96w.avif";
import brunaVizzottoWebp from "@/assets/testimonials/bruna-vizzotto-96w.webp";
import marthaIzabelPhoto from "@/assets/testimonials/martha-izabel.jpg";
import marthaIzabelAvif from "@/assets/testimonials/martha-izabel-96w.avif";
import marthaIzabelWebp from "@/assets/testimonials/martha-izabel-96w.webp";
import tainaraConradBassaniPhoto from "@/assets/testimonials/tainara-conrad-bassani.jpg";
import tainaraConradBassaniAvif from "@/assets/testimonials/tainara-conrad-bassani-96w.avif";
import tainaraConradBassaniWebp from "@/assets/testimonials/tainara-conrad-bassani-96w.webp";

type LinkedInRecommendation = {
  id: string;
  name: string;
  company: string;
  quote: string;
  image: {
    avif: string;
    webp: string;
    fallback: string;
  };
};

// Snapshot normalizado de Recommendations_Received.csv, exportado do LinkedIn em 2026-08-23.
export const linkedInRecommendations: LinkedInRecommendation[] = [
  {
    id: "bruna-vizzotto",
    name: "Bruna Vizzotto",
    company: "ADP Brazil Labs",
    image: {
      avif: brunaVizzottoAvif,
      webp: brunaVizzottoWebp,
      fallback: brunaVizzottoPhoto,
    },
    quote:
      "Tivemos a oportunidade de atuar juntos em um projeto de tecnologia para a Grendene, por meio da Unisinos, e a contribuição dele foi fundamental para o avanço da equipe. O Guilherme possui uma postura profissional admirável, unindo pensamento analítico com uma execução extremamente organizada. Ele teve um papel crucial na estruturação do nosso fluxo de trabalho, facilitando o andamento das demandas e o alinhamento de todo o time. Além disso, sua proatividade chamou muita atenção no dia a dia: ele constantemente se antecipava aos desafios técnicos e propunha melhorias e nas regras de negócio antes mesmo que se tornassem bloqueios. Ele compreende profundamente a dinâmica de projetos de desenvolvimento colaborativo e tem uma ótima comunicação. Qualquer empresa ou equipe que busque um profissional engajado, colaborativo e focado em entregas de alto nível terá muita sorte em contar com ele.",
  },
  {
    id: "martha-izabel-di-franco-machado",
    name: "Martha Izabel Di Franco Machado",
    company: "Bistrô",
    image: {
      avif: marthaIzabelAvif,
      webp: marthaIzabelWebp,
      fallback: marthaIzabelPhoto,
    },
    quote:
      "Quando voluntariou para a ADEVIC, onde eu era assessora de comunicação na época, o Guilherme entregou um trabalho consistente e estruturado. Com seu olhar criativo e técnico, promoveu melhorias que fizeram e fazem a diferença para a associação até hoje.",
  },
  {
    id: "alecsandra-klatt-martins",
    name: "Alecsandra Klatt Martins",
    company: "Saque e Pague",
    image: {
      avif: alecsandraKlattMartinsAvif,
      webp: alecsandraKlattMartinsWebp,
      fallback: alecsandraKlattMartinsPhoto,
    },
    quote:
      "Eu recomendo Guilherme pois ele e muito centrado efetua de forma eficaz e cautelosa suas tarefas tem conhecimentos administrativos e pro ativo e trabalha muito bem em equipe. E tem um ótimo raciocínio e uma boa memoria.",
  },
  {
    id: "tainara-conrad-bassani",
    name: "Tainara Conrad Bassani",
    company: "General Motors",
    image: {
      avif: tainaraConradBassaniAvif,
      webp: tainaraConradBassaniWebp,
      fallback: tainaraConradBassaniPhoto,
    },
    quote:
      "Guilherme é um jovem cheio de ideias, focado e que fornece toda ajuda que você precisar. Sempre comprometido com todas as tarefas, as quais conseguia terminar com êxito mesmo sob pressão constante. Sabe interagir, tem um bom relacionamento com todos os colegas, além de ser responsável e dedicado.",
  },
];
