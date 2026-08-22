export type Story = {
  slug: string;
  title: string;
  minutes: number;
  age: string;
  text: string;
  tone: string;
  paragraphs: string[];
};

export const stories: Story[] = [
  {
    slug: "la-semilla-que-no-queria-dormir",
    title: "La semilla que no quería dormir",
    minutes: 5,
    age: "4–6 años",
    text: "Una semilla curiosa descubre por qué la noche también hace crecer.",
    tone: "bg-secondary",
    paragraphs: [
      "En un rincón del huerto vivía una semilla pequeñita que se llamaba Pip. Pip tenía mucha curiosidad y no quería dormir nunca, porque pensaba que de noche pasaban las cosas más interesantes del mundo.",
      "Cada tarde, cuando el sol se escondía detrás del cerro, la tierra susurraba: «Duerme, Pip, duerme». Pero Pip abría un ojito, luego el otro, y se quedaba escuchando a los grillos afinar sus violines.",
      "Una noche, la Luna se asomó entre las hojas y le dijo bajito: «Yo también trabajo mientras duermes. Riego los sueños de las raíces para que mañana puedan estirarse un poquito más».",
      "Pip lo pensó, bostezó tres veces y cerró los ojos. Y esa misma noche, sin darse cuenta, le creció una raíz valiente y una hoja verde y suave.",
      "Al despertar, Pip descubrió el secreto más bonito del huerto: dormir también es una forma de crecer.",
    ],
  },
  {
    slug: "el-rio-de-los-mil-colores",
    title: "El río de los mil colores",
    minutes: 7,
    age: "6–8 años",
    text: "Dos hermanas siguen un río que cambia de color en cada curva.",
    tone: "bg-cream",
    paragraphs: [
      "Nuria y Bela vivían en una casa de madera junto a un río muy raro: en cada curva cambiaba de color, como si alguien fuera pintándolo por dentro.",
      "«¿De dónde salen los colores?», preguntó Bela una mañana. Nuria guardó dos manzanas en la mochila y dijo: «Vamos a averiguarlo».",
      "En la primera curva el río era dorado, porque el sol se había bañado allí al amanecer. En la segunda era azul profundo, del color que dejan las lluvias cuando se despiden.",
      "En la tercera curva encontraron a una garza que pintaba con la punta del ala. «No pinto el agua», explicó la garza, «solo le recuerdo lo que ha visto».",
      "Las hermanas volvieron a casa con los pies mojados y una idea preciosa: los ríos, como las personas, guardan todos los colores de los días que han vivido.",
    ],
  },
];

export const getStory = (slug: string) => stories.find((s) => s.slug === slug);
