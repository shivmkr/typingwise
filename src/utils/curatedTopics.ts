import { TopicContent } from '../types';

export const CURATED_TOPICS: TopicContent[] = [
  {
    title: 'Artificial Intelligence',
    category: 'Computer Science',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80',
    difficulty: 'Medium',
    wordCounts: { quick: 128, standard: 312, deep: 685 },
    passages: {
      quick: `Artificial intelligence is a field of computer science concerned with building systems capable of performing tasks that normally require human intelligence. These tasks include visual perception, speech recognition, decision-making, and language translation. Modern artificial intelligence predominantly relies on machine learning, where algorithms identify patterns in vast datasets rather than following rigid pre-written instructions. Deep neural networks, inspired by biological brains, have enabled breakthroughs in generative models, robotics, and automated scientific discovery. As artificial intelligence advances, researchers actively study computational ethics, algorithmic transparency, and methods to align automated decisions with human welfare.`,
      standard: `Artificial intelligence is a branch of computer science focused on creating machines capable of mimicking human cognitive functions. In its earliest decades, researchers pursued symbolic reasoning and knowledge graphs to solve logical puzzles and play chess. However, the modern revolution is driven by machine learning, where statistical models extract predictive patterns directly from real-world data.

Neural networks are the foundation of contemporary breakthroughs. By organizing mathematical nodes into hierarchical layers, deep learning algorithms detect intricate relationships in audio, image pixels, and linguistic structures. For example, large language models leverage transformer architectures with attention mechanisms, enabling coherent reasoning across diverse domains.

Real-world applications of artificial intelligence now touch healthcare diagnostics, climate modeling, autonomous transportation, and software engineering. Meanwhile, critical research continues into interpretability, data governance, and existential safety, ensuring that automated systems remain reliable, unbiased, and beneficial for humanity.`,
      deep: `Artificial intelligence is an interdisciplinary domain combining mathematics, statistics, computer science, and neuroscience to synthesize intelligent agency. Alan Turing inaugurated the philosophical inquiry into computational thought in 1950 with his famous imitation game, asking whether a digital computer could exhibit behavior indistinguishable from a human mind. During the 1956 Dartmouth workshop, John McCarthy, Marvin Minsky, and colleagues formally coined the term and laid the groundwork for decades of research.

Early systems relied heavily on expert rules, formal logic, and symbolic computation. While successful in narrow domains like algebraic reasoning, these systems struggled with perceptual ambiguity, sensory noise, and natural language subtleties. This led to periods known as AI winters, where funding and academic interest declined.

The turning point occurred with the convergence of scalable computing hardware, specifically graphics processing units, and massive digital datasets. Supervised learning algorithms, powered by backpropagation in multi-layer neural networks, demonstrated human-level accuracy in image classification and conversational synthesis. Transformer architectures subsequent to 2017 revolutionized natural language processing by calculating dynamic attention weights across entire sequences simultaneously.

Today, frontier artificial intelligence research addresses autonomous reasoning, embodied robotics, safety alignment, and neuro-symbolic hybrids. Ensuring that these high-capacity computational models operate safely, fairly, and transparently remains one of the central scientific challenges of the twenty-first century.`
    },
    keyTakeaways: [
      'Artificial intelligence creates computational systems that simulate human cognitive tasks like perception and reasoning.',
      'Modern AI is powered by machine learning and deep neural networks trained on extensive datasets.',
      'The transformer architecture and attention mechanisms unlocked breakthroughs in natural language understanding.',
      'Core research areas include alignment, algorithmic transparency, and ethical computational governance.'
    ],
    quiz: [
      {
        question: 'What is the primary driving mechanism of modern artificial intelligence breakthroughs?',
        options: [
          'Machine learning and deep neural networks trained on data',
          'Manual entry of billions of static IF-THEN code statements',
          'Analog mechanical clockwork mechanisms',
          'Random character generation'
        ],
        correctIndex: 0,
        explanation: 'Modern AI relies on statistical machine learning models that learn patterns directly from data.'
      },
      {
        question: 'Who coined the term "Artificial Intelligence" at the 1956 Dartmouth conference?',
        options: [
          'John McCarthy',
          'Charles Babbage',
          'Isaac Newton',
          'Nikola Tesla'
        ],
        correctIndex: 0,
        explanation: 'John McCarthy, alongside Marvin Minsky and others, formally coined the term at Dartmouth in 1956.'
      },
      {
        question: 'What architectural innovation in 2017 revolutionized natural language processing?',
        options: [
          'Transformers with dynamic attention mechanisms',
          'Punch cards with binary relays',
          'Vacuum tubes for memory registers',
          'Static lookup dictionary tables'
        ],
        correctIndex: 0,
        explanation: 'Transformers enabled models to weigh words in relation to all other words across whole passages.'
      }
    ]
  },
  {
    title: 'Space Exploration & Astronomy',
    category: 'Astronomy & Physics',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    difficulty: 'Medium',
    wordCounts: { quick: 122, standard: 295, deep: 610 },
    passages: {
      quick: `Space exploration is the discovery and scientific exploration of celestial structures in outer space through manned spaceflight and robotic probes. The space age commenced in October 1957 when the Soviet Union launched Sputnik 1, the first artificial satellite into Earth orbit. Twelve years later in 1969, the Apollo 11 mission landed humans on the Moon. Today, space agencies and private enterprises operate space stations, deploy rovers on Mars, and utilize orbital observatories like the James Webb Space Telescope to peer billions of light-years into the early cosmos. These missions expand our understanding of planetary science, gravitational physics, and the search for extraterrestrial life.`,
      standard: `Space exploration represents humanity's quest to venture beyond Earth and decipher the origins of the universe. The modern space race catalyzed groundbreaking developments in rocketry, propulsion chemistry, materials science, and orbital mechanics.

Robotic exploration has extended human senses to the outer reaches of the solar system. The Voyager spacecraft have crossed the heliopause into interstellar space, carrying the Golden Record as a cosmic message. Rovers such as Curiosity and Perseverance analyze martian geology for ancient biosignatures, while orbiters map the subsurface oceans of Europa and Enceladus.

Modern orbital observatories have transformed our cosmic perspective. The Hubble Space Telescope determined the expansion rate of the universe, and the James Webb Space Telescope uses infrared instruments to capture light from galaxies formed shortly after the Big Bang. International cooperation on the International Space Station proves that collaborative science can transcend geopolitical boundaries.`,
      deep: `From ancient stargazers observing planetary retrogrades to deep-space probes traversing the Kuiper belt, astronomical discovery has continuously redefined humanity's place in the cosmos. Johannes Kepler formulated empirical laws of planetary motion, providing mathematical rigor to the heliocentric model advanced by Nicolaus Copernicus. Sir Isaac Newton subsequently united terrestrial and celestial mechanics with his law of universal gravitation.

The twentieth century translated theoretical astrophysics into engineering reality. Konstantin Tsiolkovsky's rocket equation demonstrated that multi-stage liquid propellant vehicles could achieve orbital escape velocity. Following the landmark launch of Sputnik and Yuri Gagarin's historic first orbital flight in 1961, the United States Apollo program culminated in Neil Armstrong and Buzz Aldrin walking on the lunar surface in July 1969.

Contemporary space endeavors focus on sustainable presence, planetary defense, and exoplanet atmospheric characterization. Robotic landers drill into extraterrestrial regolith, while radio interferometers like the Event Horizon Telescope synthesize planetary-scale apertures to photograph supermassive black hole event horizons. As commercial launch costs decrease through reusable booster stages, the horizon of human spaceflight broadens toward permanent lunar research bases and crewed Martian voyages.`
    },
    keyTakeaways: [
      'The Space Age began in 1957 with the launch of Sputnik 1, followed by the Apollo 11 Moon landing in 1969.',
      'Robotic probes like Voyager, Curiosity, and Perseverance explore planetary surfaces and interstellar boundaries.',
      'Telescopes such as Hubble and James Webb investigate cosmic evolution and planetary atmospheres.',
      'Reusable rocketry and private-public partnerships are radically decreasing the cost of orbital access.'
    ],
    quiz: [
      {
        question: 'Which historic mission first landed humans on the Moon in July 1969?',
        options: [
          'Apollo 11',
          'Vostok 1',
          'Sputnik 2',
          'Voyager 1'
        ],
        correctIndex: 0,
        explanation: 'Apollo 11 landed astronauts Neil Armstrong and Buzz Aldrin on the lunar surface on July 20, 1969.'
      },
      {
        question: 'What optical wavelength does the James Webb Space Telescope primarily utilize to view early galaxies?',
        options: [
          'Infrared light',
          'Ultraviolet radiation only',
          'Acoustic waves',
          'Gamma ray pulses'
        ],
        correctIndex: 0,
        explanation: 'Webb is optimized for infrared astronomy, which penetrates cosmic dust and observes redshifted light.'
      },
      {
        question: 'Which spacecraft has crossed into interstellar space beyond the solar heliopause?',
        options: [
          'Voyager 1',
          'International Space Station',
          'Apollo 13',
          'Hubble Space Telescope'
        ],
        correctIndex: 0,
        explanation: 'Voyager 1 officially entered interstellar space in 2012, transmitting data from beyond our solar bubble.'
      }
    ]
  },
  {
    title: 'Indian History',
    category: 'History & Civilization',
    thumbnail: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80',
    difficulty: 'Medium',
    wordCounts: { quick: 125, standard: 300, deep: 640 },
    passages: {
      quick: `Indian history spans over five millennia of rich cultural evolution, philosophical synthesis, and architectural genius. The Indus Valley Civilization flourished around 2500 BCE, pioneering urban planning with grid-based cities, sophisticated drainage systems, and standardized brick craftsmanship. Over subsequent centuries, the subcontinent witnessed the emergence of profound spiritual traditions including Hinduism, Buddhism, and Jainism. Great empires arose, such as the Mauryan Empire under Emperor Ashoka, who renounced warfare to promote non-violence, and the Gupta Golden Age, celebrated for astronomical discoveries and mathematics, including the revolutionary concept of zero. India's historical journey shaped art, trade, and philosophical discourse across the world.`,
      standard: `The history of India is one of continuous intellectual vitality and cultural assimilation. Archaeological excavations at Harappa and Mohenjo-daro reveal that the Bronze Age Indus Valley Civilization enjoyed urban sanitation and maritime trade networks extending to Mesopotamia.

During the classical era, the subcontinent gave birth to major world religions and enduring philosophical schools. In the third century BCE, the Mauryan emperor Ashoka unified much of the subcontinent, later engraving rock edicts advocating tolerance, animal welfare, and ethical governance after witnessing the carnage of the Kalinga war.

The Gupta Empire heralded a golden era of scientific and literary achievement. Mathematicians like Aryabhata calculated the value of pi, proposed that the Earth rotates on its axis, and articulated the decimal numeral system featuring zero. Subsequent eras saw the Chola maritime dynasty trade across Southeast Asia, the synthesis of Mughal architecture culminating in the Taj Mahal, and the non-violent struggle for freedom led by Mahatma Gandhi in the twentieth century.`,
      deep: `From the alluvial plains of the Indus and Saraswati rivers to the Deccan plateau, Indian civilization has maintained an unbroken thread of philosophical and cultural continuity. The Vedic period synthesized early Sanskrit hymns and foundational cosmological literature, which matured into the introspective metaphysical inquiries of the Upanishads.

By the sixth century BCE, sixteen great kingdoms known as Mahajanapadas competed across northern India. This crucible of ideas fostered non-theistic reform movements; Siddhartha Gautama achieved enlightenment to formulate the Buddhist Middle Way, while Mahavira codified Jain tenets of universal compassion and absolute non-violence.

Dynastic epics mirrored this intellectual flourish. The Mauryan Empire, guided by the political treatise Arthashastra authored by Chanakya, established centralized administration and comprehensive taxation. Under Ashoka's patronage, Buddhist emissaries carried ethical teachings to Sri Lanka, Central Asia, and the Mediterranean.

Later centuries witnessed magnificent cultural synthesis. The Gupta renaissance nurtured the dramas of Kalidasa and the astronomical treatises of Varahamihira. In the medieval epoch, Bhakti and Sufi poet-saints democratized devotion through vernacular literature, celebrating unity across sectarian divides. The eventual struggle against British colonial rule culminated on August 15, 1947, when India emerged as an independent democratic republic, anchored by a progressive constitution drafted under Dr. B.R. Ambedkar.`
    },
    keyTakeaways: [
      'The Indus Valley Civilization pioneered sophisticated urban drainage and grid-based town planning around 2500 BCE.',
      'Emperor Ashoka embraced Buddhism and inscribed edicts across India preaching peace, tolerance, and non-violence.',
      'The Gupta Golden Age yielded transformative contributions to mathematics, notably the decimal system and the concept of zero.',
      'India gained independence in 1947 through a historic movement combining non-violent resistance and constitutional democracy.'
    ],
    quiz: [
      {
        question: 'Which ancient civilization was famed for advanced grid-planned cities and drainage systems?',
        options: [
          'Indus Valley Civilization',
          'Viking settlements',
          'Polynesian navigators',
          'Spartan agrarian camps'
        ],
        correctIndex: 0,
        explanation: 'Harappa and Mohenjo-daro demonstrated peerless Bronze Age urban planning and civic sanitation.'
      },
      {
        question: 'Which Indian mathematician-astronomer proposed that the Earth rotates on its own axis during the Gupta period?',
        options: [
          'Aryabhata',
          'Hipparchus',
          'Ptolemy',
          'Archimedes'
        ],
        correctIndex: 0,
        explanation: 'Aryabhata in the 5th century CE accurately proposed the diurnal rotation of the Earth on its axis.'
      },
      {
        question: 'After which devastating battle did Emperor Ashoka renounce violence and embrace Buddhist ethics?',
        options: [
          'Kalinga War',
          'Battle of Panipat',
          'Battle of Plassey',
          'Battle of Hydaspes'
        ],
        correctIndex: 0,
        explanation: 'The suffering Ashoka witnessed at Kalinga prompted his profound moral conversion to Dhamma.'
      }
    ]
  },
  {
    title: 'Python Programming',
    category: 'Software Engineering',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=400&q=80',
    difficulty: 'Easy',
    wordCounts: { quick: 120, standard: 280, deep: 590 },
    passages: {
      quick: `Python is a high-level, general-purpose programming language renowned for its expressive syntax and clean readability. Created by Guido van Rossum and first released in 1991, Python emphasizes code clarity through its distinctive use of significant indentation. As an interpreted, dynamically typed language, it allows developers to write prototypes quickly without manual memory allocation or verbose compilation cycles. Python supports multiple programming paradigms, including procedural, object-oriented, and functional styles. Today, Python stands as the premier language for data science, artificial intelligence, scientific computing, web development, and process automation across industries worldwide.`,
      standard: `Python has grown into one of the most beloved and widely used programming languages in modern software engineering. Its design philosophy, famously summarized in The Zen of Python, asserts that beautiful is better than ugly, explicit is better than implicit, and simple is better than complex.

A major reason for Python's dominance is its comprehensive standard library, often referred to as batteries included, alongside an ecosystem of third-party packages managed by PyPI. In numerical analysis and machine learning, libraries such as NumPy, Pandas, Scikit-learn, and PyTorch turn Python into an agile computing workbench.

In web development, frameworks like Django and FastAPI deliver scalable backend services and automated API documentation. By handling automatic garbage collection and providing intuitive data structures such as lists, dictionaries, tuples, and sets, Python empowers developers to focus on solving business problems rather than wrestling with pointer arithmetic or memory leaks.`,
      deep: `Conceived in the late 1980s at Centrum Wiskunde and Informatica in the Netherlands, Python was named in homage to the British comedy troupe Monty Python. Guido van Rossum sought to build a scripting language that bridged the gap between Bourne shell scripts and low-level C programming, incorporating exception handling and interfaces to the Amoeba operating system.

Python's execution model typically compiles source code into intermediate bytecode, which is subsequently interpreted by the CPython virtual machine. Memory management employs reference counting supplemented by a cyclic generational garbage collector to resolve circular references between objects. The language implements dynamic typing with strong enforcement, meaning variable types are verified at runtime rather than checked at compile time.

A defining characteristic of Python is its data model, often termed dunder or magic methods. By implementing methods such as __iter__, __getitem__, and __call__, developer-defined classes can seamlessly integrate with core language operators. In recent revisions, Python introduced type annotations via the typing module, pattern matching syntax, and significant performance optimizations through specialized bytecode evaluation engines.`
    },
    keyTakeaways: [
      'Python was created by Guido van Rossum and first released in 1991 with a focus on code readability.',
      'Significant whitespace indentation replaces braces to define code blocks, promoting consistent styling.',
      'Python is dynamically typed and garbage-collected, supporting object-oriented and functional paradigms.',
      'Dominates data science, machine learning, and automation through libraries like NumPy, Pandas, and PyTorch.'
    ],
    quiz: [
      {
        question: 'Who created the Python programming language in 1991?',
        options: [
          'Guido van Rossum',
          'Dennis Ritchie',
          'Bjarne Stroustrup',
          'James Gosling'
        ],
        correctIndex: 0,
        explanation: 'Guido van Rossum developed Python at CWI in the Netherlands, releasing version 0.9.0 in 1991.'
      },
      {
        question: 'How does Python define code blocks instead of using curly braces?',
        options: [
          'Consistent indentation with whitespace',
          'Semicolons at the end of every line',
          'Angle brackets and tags',
          'Parentheses enclosing all logic'
        ],
        correctIndex: 0,
        explanation: 'Python uniquely uses indentation to delimit function, loop, and conditional blocks.'
      },
      {
        question: 'Which of the following is a fundamental Python dictionary data structure characteristic?',
        options: [
          'Key-value pairs with fast hash-table lookup',
          'Fixed memory arrays requiring manual allocation',
          'Ordered binary trees only',
          'Single-bit registers'
        ],
        correctIndex: 0,
        explanation: 'Python dicts store key-value mappings implemented using an optimized hash table.'
      }
    ]
  },
  {
    title: 'Cricket & Sports Science',
    category: 'Sports & Kinetics',
    thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80',
    difficulty: 'Easy',
    wordCounts: { quick: 118, standard: 275, deep: 580 },
    passages: {
      quick: `Cricket is a globally celebrated bat-and-ball team sport played between two competing teams of eleven players on an oval grass field. In the center lies a 22-yard rectangular pitch flanked by three-stump wickets at each end. Modern cricket operates across three primary international formats: multi-day Test matches, 50-over One Day Internationals, and high-intensity 20-over Twenty20 fixtures. Beyond traditional strategy, sports science plays a decisive role in contemporary cricket. Biomechanics governs fast bowling techniques to maximize swing and reduce spinal stress, while high-speed cameras and radar track ball trajectory with millimeter precision.`,
      standard: `Cricket evolved from rural pastimes in southeast England during the sixteenth century to become the world's second most watched spectator sport, passionately followed by billions across South Asia, Australasia, the Caribbean, and the United Kingdom.

The contest pivots upon the duel between bowler and batter. Bowlers employ seam, finger spin, and wrist spin, utilizing aerodynamic principles like reverse swing to deceive opponents through the air and off the pitch. Batters counter with delicate footwork, shot selection, and power hitting to score runs.

Today, data analytics and technology have revolutionized tactical preparation. Ball-tracking algorithms such as Hawk-Eye, thermal imaging Hot Spot, and snickometer sound analysis resolve contentious umpire decisions under the Decision Review System. Athletic conditioning, GPS tracking vests, and hydration monitoring ensure athletes sustain peak performance during grueling heat and multi-week tournaments.`,
      deep: `The earliest recorded match of cricket dates to Guildford in 1597. Over successive centuries, the Marylebone Cricket Club codified the Laws of Cricket, standardizing equipment specifications and pitch dimensions. The inaugural international Test match took place in 1877 at Melbourne between Australia and England, instituting the storied Ashes rivalry.

Aerodynamics explains the subtle physics that dictate bowling excellence. Conventional swing occurs when laminar airflow on the smooth side of the leather ball separates earlier than turbulent flow on the rough, raised-seam side, generating a lateral pressure differential. In reverse swing, discovered by Pakistani fast bowlers in the late twentieth century, boundary layer dynamics invert at high velocities, causing older scuffed balls to dart sharply into the batter.

In the twenty-first century, the explosive ascent of franchise Twenty20 leagues, exemplified by the Indian Premier League, fundamentally transformed cricket economics, player training, and broadcast spectacle. 360-degree batting innovations, such as the scoop and ramp shot, demonstrate how kinetic chaining and wrist torque unlock boundaries in previously unguarded zones of the oval.`
    },
    keyTakeaways: [
      'Cricket is played between two teams of eleven players on a 22-yard central pitch.',
      'Three main formats exist: traditional 5-day Test matches, 50-over ODIs, and 20-over T20 matches.',
      'Aerodynamic principles dictate how air pressure differentials cause conventional and reverse swing.',
      'Modern cricket uses optical tracking, thermal cameras, and GPS vests to analyze player performance.'
    ],
    quiz: [
      {
        question: 'What is the standard length of a cricket pitch between the wickets?',
        options: [
          '22 yards (approximately 20.12 meters)',
          '50 yards',
          '15 meters',
          '100 feet'
        ],
        correctIndex: 0,
        explanation: 'The Laws of Cricket strictly specify a 22-yard pitch distance between the bowling creases.'
      },
      {
        question: 'What aerodynamic phenomenon causes an older cricket ball to move sharply at high speed?',
        options: [
          'Reverse swing',
          'Centrifugal lift',
          'Doppler sonic wave',
          'Acoustic resonance'
        ],
        correctIndex: 0,
        explanation: 'Reverse swing occurs when boundary layer air transitions create late movement opposite to conventional swing.'
      },
      {
        question: 'Which ball-tracking technology is widely used in the Decision Review System (DRS)?',
        options: [
          'Hawk-Eye',
          'Sonar ping',
          'Magnetic compass',
          'Barometric sensor'
        ],
        correctIndex: 0,
        explanation: 'Hawk-Eye uses triangulated high-frame cameras to calculate and project ball trajectory.'
      }
    ]
  },
  {
    title: 'Psychology & Human Behavior',
    category: 'Behavioral Science',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    difficulty: 'Hard',
    wordCounts: { quick: 130, standard: 310, deep: 630 },
    passages: {
      quick: `Psychology is the scientific discipline dedicated to investigating mind, mental processes, and human behavior. It encompasses conscious and unconscious experiences, cognitive faculties like attention and memory, and emotional regulation. Historically emerging from philosophical epistemology, modern psychology was established as an empirical laboratory science in 1879 by Wilhelm Wundt in Leipzig. Contemporary psychologists integrate neuroimaging, experimental design, and behavioral metrics to understand how humans perceive the world, make decisions under uncertainty, and form social bonds. Applied branches like clinical and cognitive psychology develop evidence-based therapies to foster mental resilience and optimize human learning.`,
      standard: `Psychology examines the complex interplay between neurobiological mechanisms, individual cognitive patterns, and social environments. Rather than relying on intuition, psychologists formulate empirical hypotheses tested through randomized controlled trials, longitudinal surveys, and functional magnetic resonance imaging.

Cognitive psychology explores how the human brain encodes, organizes, and retrieves information. For instance, the cognitive architecture distinguishes between sensory storage, working memory with limited capacity, and consolidated long-term memory. Behavioral economists such as Daniel Kahneman and Amos Tversky unveiled how human judgment is influenced by heuristics and systematic cognitive biases, such as confirmation bias and loss aversion.

In developmental and clinical psychology, researchers map how emotional attachment styles formed in early childhood influence adult interpersonal relationships. Meanwhile, cognitive behavioral therapy empowers individuals by identifying and restructuring distorted thought patterns, demonstrating neuroplastic adaptation throughout the human lifespan.`,
      deep: `The genesis of psychological science represents a transition from speculative philosophy regarding the soul to rigorous scientific quantification. Wilhelm Wundt established structuralism, utilizing trained introspection to map elemental sensations. William James countered with functionalism, positing that consciousness evolved as an adaptive instrument aiding organismic survival in line with Darwinian principles.

The twentieth century experienced conflicting theoretical paradigms. Sigmund Freud introduced psychoanalysis, proposing that repressed unconscious desires shape neurotic symptoms. In sharp contrast, behaviorists like John Watson and B.F. Skinner rejected subjective mental states entirely, insisting that psychology should measure observable stimulus-response contingencies and operant conditioning.

The cognitive revolution of the 1960s restored the mind to center stage, conceptualizing the brain as an information-processing system. Today, affective neuroscience bridges neuroanatomy with behavioral psychology, examining how neurotransmitters such as dopamine, serotonin, and norepinephrine modulate motivation, learning, and executive functioning in the prefrontal cortex.`
    },
    keyTakeaways: [
      'Psychology is the empirical science of mind, mental phenomena, and human behavior.',
      'Wilhelm Wundt founded the first dedicated psychology laboratory in 1879 in Leipzig, Germany.',
      'Working memory has finite capacity, while long-term memory relies on neuroplastic synaptic consolidation.',
      'Cognitive behavioral psychology shows that cognitive appraisals directly govern emotional responses.'
    ],
    quiz: [
      {
        question: 'Who established the first psychological research laboratory in Leipzig in 1879?',
        options: [
          'Wilhelm Wundt',
          'Sigmund Freud',
          'Carl Jung',
          'Ivan Pavlov'
        ],
        correctIndex: 0,
        explanation: 'Wilhelm Wundt is recognized as the father of experimental psychology for opening the Leipzig lab in 1879.'
      },
      {
        question: 'Which cognitive bias refers to the tendency to favor information that confirms preexisting beliefs?',
        options: [
          'Confirmation bias',
          'Halo effect',
          'Anchoring heuristic',
          'Sunk cost fallacy'
        ],
        correctIndex: 0,
        explanation: 'Confirmation bias leads people to search for, interpret, and recall information aligning with prior hypotheses.'
      },
      {
        question: 'Which brain region is critically associated with executive function, decision-making, and self-control?',
        options: [
          'Prefrontal cortex',
          'Occipital lobe',
          'Cerebellar tonsil',
          'Medulla oblongata'
        ],
        correctIndex: 0,
        explanation: 'The prefrontal cortex coordinates higher-order planning, impulse inhibition, and working memory.'
      }
    ]
  },
  {
    title: 'Computer Networks & Cybersecurity',
    category: 'Computer Science',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
    difficulty: 'Hard',
    wordCounts: { quick: 124, standard: 295, deep: 620 },
    passages: {
      quick: `A computer network is a system of interconnected computing devices that exchange data and share resources using digital communications protocols. The foundational architecture of the global Internet relies on the TCP/IP suite, where information is dissected into discrete packets, routed across intermediate routers, and reassembled at the destination. With the exponential growth of networked systems, cybersecurity has become paramount. It encompasses technologies, processes, and defense practices designed to protect networks, cloud infrastructure, and sensitive data from unauthorized intrusions, ransomware, and denial-of-service disruptions. Public-key cryptography, firewalls, and zero-trust security architectures form the bulwark of modern digital infrastructure.`,
      standard: `The modern world operates upon layered communication architectures codified by the OSI seven-layer model and the practical four-layer TCP/IP stack. Physical and data link layers manage signal transmission across fiber-optic cables and wireless radio frequencies, while the network layer uses the Internet Protocol to address and route packets across disparate networks.

Transport protocols ensure reliable delivery: TCP provides connection-oriented, sequenced, and error-checked streams through three-way handshakes, whereas UDP prioritizes low-latency throughput for video streaming and online gaming.

Cybersecurity addresses the vulnerabilities inherent in open connectivity. The CIA triad—confidentiality, integrity, and availability—guides security engineering. Asymmetric cryptography algorithms like RSA and elliptic-curve cryptography safeguard digital signatures and HTTPS connections. Meanwhile, modern enterprises transition from perimeter defenses to Zero Trust architectures, which operate on the principle of never trust, always verify for every internal and external access request.`,
      deep: `The Internet trace its lineage to ARPANET, sponsored by the United States Department of Defense in 1969 to construct a robust, decentralized communications network resilient to localized node failures. Vinton Cerf and Robert Kahn subsequently designed the Transmission Control Protocol and Internet Protocol, decoupling physical transmission media from higher-level software applications.

At the network edge, Border Gateway Protocol facilitates routing between autonomous systems, while the Domain Name System translates human-readable hostnames into numeric IP addresses. However, because early Internet protocols prioritized open academic cooperation over hardened confidentiality, subsequent decades witnessed escalating attack vectors, from packet sniffing and DNS spoofing to distributed denial-of-service botnets.

Modern cybersecurity employs defense-in-depth methodologies. Symmetric ciphers like AES-256 secure data at rest, while TLS 1.3 establishes encrypted tunnels in transit. Security teams employ intrusion detection systems, endpoint telemetry, and automated security orchestration to detect anomalous lateral movement across compromised subnets before threat actors can exfiltrate sensitive institutional assets.`
    },
    keyTakeaways: [
      'The Internet operates using packet-switched networking governed by the TCP/IP protocol suite.',
      'TCP guarantees ordered, reliable data delivery, whereas UDP prioritizes minimal transmission latency.',
      'Cybersecurity defenses are built around the CIA triad: Confidentiality, Integrity, and Availability.',
      'Zero Trust architecture assumes threats exist inside the network, enforcing continuous authentication.'
    ],
    quiz: [
      {
        question: 'Which transport layer protocol provides reliable, connection-oriented, and error-checked packet delivery?',
        options: [
          'TCP (Transmission Control Protocol)',
          'UDP (User Datagram Protocol)',
          'ICMP',
          'ARP'
        ],
        correctIndex: 0,
        explanation: 'TCP establishes a connection via a three-way handshake and retransmits lost packets.'
      },
      {
        question: 'What core security principle is embodied by the Zero Trust architectural framework?',
        options: [
          'Never trust, always verify',
          'Trust all devices connected to the internal office Wi-Fi',
          'Rely exclusively on a single perimeter firewall',
          'Disable all encryption to increase packet speed'
        ],
        correctIndex: 0,
        explanation: 'Zero Trust assumes no implicit trust granted to assets based on physical or network location.'
      },
      {
        question: 'What does the acronym CIA stand for in fundamental cybersecurity engineering?',
        options: [
          'Confidentiality, Integrity, and Availability',
          'Central Intelligence Agency only',
          'Computation, Internet, and Algorithms',
          'Cryptography, IP address, and Access'
        ],
        correctIndex: 0,
        explanation: 'The CIA triad is the foundational model guiding information security policies.'
      }
    ]
  }
];
