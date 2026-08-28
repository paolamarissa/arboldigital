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
    minutes: 6,
    age: "4–6 años",
    text: "Una semilla curiosa descubre por qué la noche también hace crecer.",
    tone: "bg-secondary",
    paragraphs: [
      "En un rincón del huerto, enterrada bajo una manta de tierra tibia, vivía una semilla pequeñita que se llamaba Pip. Era redonda, morenita y tenía una rayita dorada que parecía una sonrisa. Pip era muy curiosa, tan curiosa, que no quería dormir nunca.",
      "«¿Para qué dormir?», se preguntaba, «si de noche pasan las cosas más interesantes del mundo».",
      "Cada tarde, cuando el sol se escondía detrás del cerro y el cielo se ponía color naranja, la tierra susurraba con voz suave: «Duerme, Pip, duerme. Mañana será un día muy largo». Pero Pip abría un ojito, luego el otro, y se quedaba despierta escuchando el concierto de la noche.",
      "¡Y vaya concierto! Los grillos afinaban sus violines verdes, las ranas cantaban en coro junto al charco y el viento jugaba a hacer bailar las hojas del sauce. Pip escuchaba todo con el corazón acelerado, sin pestañear, no fuera a perderse algo importante.",
      "Una noche de verano, la Luna se asomó entre las hojas. Era una luna redonda y luminosa, de las que parecen una sonrisa colgada del cielo. Al ver a Pip despierta, se acercó un poco más y le dijo bajito:",
      "«Pequeña Pip, ¿por qué no duermes? ¿Sabes? Yo también trabajo mientras tú duermes. Riego los sueños de todas las raíces del huerto para que mañana puedan estirarse un poquito más. El descanso también es un trabajo, el más dulce de todos».",
      "Pip lo pensó despacio. Miró a la Luna, miró las estrellas que parpadeaban como luciérnagas dormidas, y de pronto sintió que sus ojitos pesaban como piedritas. Bostezó una vez. Bostezó dos veces. Bostezó tres veces, tan fuerte que las hojas de la hierba se movieron.",
      "«Está bien, Luna», susurró Pip con voz ya soñolienta. «Solo esta noche… probaré a dormir». Y cerró los ojos, abrazada a su manta de tierra tibia.",
      "Y esa misma noche, mientras Pip soñaba con lunas que regaban estrellas, ocurrió la magia: sin darse cuenta, le creció una raíz valiente que se estiró hacia abajo, y una hoja verde y suave que se asomó hacia el cielo.",
      "Por la mañana, el sol la despertó con un beso dorado. Pip abrió los ojos, miró su hojita nueva, y descubrió el secreto más bonito del huerto: dormir también es una forma de crecer. Desde entonces, cada noche duerme profundamente… y cada mañana despierta un poquito más alta.",
    ],
  },
  {
    slug: "el-rio-de-los-mil-colores",
    title: "El río de los mil colores",
    minutes: 8,
    age: "6–8 años",
    text: "Dos hermanas siguen un río que cambia de color en cada curva.",
    tone: "bg-cream",
    paragraphs: [
      "Nuria y Bela vivían en una casa de madera con tejado rojo, junto a un río muy, muy raro. ¿Por qué era raro? Pues porque en cada curva cambiaba de color, como si alguien fuera pintándolo por dentro con un pincel gigante e invisible.",
      "Los vecinos del pueblo le tenían un poco de respeto. «Los ríos serios son siempre del mismo color», decía el señor Tomás mientras se ajustaba las gafas. Pero Nuria y Bela pensaban que los ríos aburridos son siempre del mismo color, y que el suyo era el río más divertido del mundo.",
      "Una mañana de primavera, Bela despertó a su hermana con una pregunta que llevaba días dándole vueltas en la cabeza: «Nuria… ¿de dónde salen los colores del río?». Nuria se quedó pensando un momento, guardó dos manzanas rojas en la mochila y dijo: «Vamos a averiguarlo».",
      "Se calzaron las botas, cruzaron el prado y empezaron a caminar río arriba, siguiendo la primera curva. Allí el agua brillaba dorada, como una cinta de oro líquido que se movía. «¡El río se ha vuelto de oro!», gritó Bela. Y entonces vieron el motivo: el sol acababa de levantarse y se estaba bañando en esa curva, dejando en el agua todo su color amarillo del amanecer.",
      "Siguieron caminando y llegaron a la segunda curva. Allí el río era azul profundo, tan azul que daban ganas de zambullirse en él. «Este azul lo conozco», dijo Nuria, «es el color que dejan las lluvias cuando se despiden». Y era verdad: una nube pequeñita descansaba sobre el agua, recordando la tormenta de la noche anterior.",
      "En la tercera curva encontraron una sorpresa con patas: una garza blanca y elegante que pintaba el agua con la punta del ala, haciendo círculos rosas y violetas. Las hermanas se quedaron tan quietas que hasta dejaron de respirar.",
      "«Disculpa, señora garza», preguntó Bela con educación, «¿eres tú la que pinta el río?». La garza soltó una risita suave, como el agua cuando tropieza con las piedras. «No pinto el agua, pequeñas. Solo le recuerdo lo que ha visto: el sol del amanecer, la lluvia que se despide, las flores que se asoman a beber… El río guarda todo lo que vive, y yo solo le ayudo a recordarlo».",
      "Nuria y Bela se miraron con los ojos muy abiertos. De pronto todo tenía sentido: el río no cambiaba de color por casualidad. ¡Se vestía con los colores de sus recuerdos!",
      "Compartieron las manzanas con la garza (que prefirió un pececito) y emprendieron el camino de vuelta. En cada curva, el río les regaló un color nuevo, como quien enseña un álbum de fotos: el verde del bosque, el naranja de la tarde, el gris brillante de las piedras mojadas.",
      "Las hermanas volvieron a casa con los pies mojados y una idea preciosa que les cabía en el corazón: los ríos, como las personas, guardan todos los colores de los días que han vivido. Y desde esa mañana, cada vez que se sienten un poco grises, Nuria y Bela van al río a recordar sus colores.",
    ],
  },
];

export const getStory = (slug: string) => stories.find((s) => s.slug === slug);
