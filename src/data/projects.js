export const projectsData = [
  {
    id: 'proj-chakravyuha',
    title: 'Chakravyuha Obfuscator',
    shortDesc: 'An intelligent C/C++ obfuscation engine using the LLVM framework to protect software from reverse engineering.',
    thumbnail: '/assets/chakravyuha_thumb.png',
    fullDesc: `Chakravyuha is an intelligent, adaptive C/C++ obfuscation engine built on the LLVM compiler framework.
It protects software intellectual property from reverse engineering and tampering by injecting
sophisticated, layered code transformations directly into the compilation pipeline.`,
    features: [
      "Integrates directly with LLVM's pass manager for seamless compilation.",
      "Implements multiple obfuscation techniques like bogus control flow and instruction substitution.",
      "Designed to be context-aware, applying transformations intelligently to minimize performance overhead."
    ],
    techStack: ['C++', 'LLVM', 'CMake', 'Systems Programming'],
    github: 'https://github.com/0bVdnt/POC-Chakravyuha.git'
  },
  {
    id: 'proj-gameoflife-wasm',
    title: 'GameOfLife-Wasm',
    shortDesc: "Conway's Game of Life in C++, compiled to WebAssembly for near-native performance in the browser.",
    thumbnail: '/assets/game_of_life_wasm.gif',
    fullDesc: `This project is a high-performance implementation of Conway's Game of Life that runs directly in the
browser. The core simulation logic is written in C++ and then compiled to WebAssembly (Wasm) using the
Emscripten toolchain. This approach allows for computationally-intensive logic to execute at near-native
speeds, far surpassing what is possible with standard JavaScript.`,
    features: [
      "Leverages WebAssembly to run C++ code in the browser for maximum performance.",
      "JavaScript acts as a lightweight controller, interacting with the high-speed Wasm module.",
      "Demonstrates manual memory management in C++ for the simulation grid to optimize speed."
    ],
    techStack: ['C++', 'WebAssembly', 'Emscripten', 'JavaScript', 'Performance'],
    github: 'https://github.com/0bVdnt/GameOfLife-WebAssembly'
  },
  {
    id: 'proj-obvcc',
    title: 'obvcc Compiler',
    shortDesc: 'A simple compiler for a subset of C, featuring a full pipeline from lexical analysis to assembly code generation.',
    thumbnail: '/assets/obvcc.png',
    fullDesc: `obvcc is a multi-stage compiler that transforms a minimal, C-like language into platform-aware x64
assembly. The entire pipeline, including a lexer, parser, assembly generator, and code emitter, was
built from scratch. This project provided a deep, hands-on understanding of language design, parsing
theory, and code generation.`,
    features: [
      "Complete, end-to-end compiler pipeline implemented in OCaml and Rust.",
      "Platform-aware code generation for x64 assembly.",
      "Demonstrates a strong grasp of compiler construction principles."
    ],
    techStack: ['Rust', 'OCaml', 'Compiler Design', 'Systems Programming'],
    github: 'https://github.com/0bVdnt/obvcc.git'
  },
  {
    id: 'proj-obv-os',
    title: 'obv-OS',
    shortDesc: 'A minimal, bootable 32-bit kernel built from scratch for the RISC-V architecture, running in a QEMU VM.',
    thumbnail: '/assets/obv-os.png',
    fullDesc: `obv-OS is a minimal, bootable 32-bit operating system kernel designed for the RISC-V architecture. This
project was an exercise in understanding the absolute fundamentals of computing, from bootloading and
memory management to interacting directly with hardware via inline assembly. The kernel runs in a QEMU
virtual machine.`,
    features: [
      "Built entirely from scratch, with no external OS libraries.",
      "Uses a combination of C and inline assembly (__asm__) for low-level control.",
      "Targets the popular RISC-V ISA, a modern instruction set architecture for learning."
    ],
    techStack: ['C', 'Assembly', 'Systems Programming', 'QEMU', 'RISC-V'],
    github: 'https://github.com/0bVdnt/obv-OS.git'
  },
  {
    id: 'proj-katha-gpt',
    title: 'katha-gpt',
    shortDesc: 'A ~50M parameter language model built from scratch in PyTorch to generate stories in the Marathi language.',
    thumbnail: '/assets/katha-gpt_thumb.png',
    fullDesc: `katha-gpt is a generative language model with ~50 million parameters, built entirely from scratch based
on the GPT-2 architecture. The entire machine learning pipeline—from the custom BPE tokenizer and data
pre-processing to the training loop and inference logic—was implemented in PyTorch. The model is trained
on a custom dataset to generate coherent, original stories in the Marathi language from a user prompt.`,
    features: [
      "Full implementation of the GPT-2 architecture, including multi-head self-attention.",
      "Custom Byte-Pair Encoding (BPE) tokenizer built from the ground up.",
      "Demonstrates end-to-end ownership of a deep learning project from theory to implementation."
    ],
    techStack: ['PyTorch', 'Python', 'AI/ML', 'NLP'],
    github: 'https://github.com/0bVdnt/katha-gpt'
  },
  {
    id: 'proj-paywiz',
    title: 'PayWiz Payments App',
    shortDesc: 'A full-stack payments application built with the MERN stack (MongoDB, Express, React, Node.js).',
    thumbnail: '/assets/paywiz_thumb.png',
    fullDesc: `PayWiz is a complete, full-stack payments application built using the MERN stack. It simulates a basic
peer-to-peer wallet, allowing users to sign up, manage their balance, and send money to other users. The
project emphasizes a clean, maintainable, and secure architecture, featuring a RESTful API backend and a
responsive React frontend.`,
    features: [
      "Secure user authentication and authorization using JSON Web Tokens (JWT).",
      "Robust backend API with atomic database transactions for safe balance transfers.",
      "Modern, component-based frontend built with React.js, following industry best practices."
    ],
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Full-Stack'],
    github: 'https://github.com/0bVdnt/PayWiz.git'
  }
];

export const workbenchProjects = [
  {
    id: 'proj-jerm',
    title: 'Jerm Terminal',
    shortDesc: "A high-performance, cross-platform terminal in modern Java (JDK 21+) using Project Loom for highly concurrent, non-blocking UI.",
    thumbnail: '/assets/jerm_thumb.png',
    fullDesc: `Jerm is a high-performance, cross-platform terminal application built from scratch using modern Java
(JDK 21+). The application provides a unified Text-based User Interface (TUI) for executing commands on
native shells (PowerShell, Bash, etc.). The core architecture leverages Java's Virtual Threads (Project
Loom) for highly concurrent, non-blocking I/O, ensuring a responsive and efficient UI.`,
    features: [
      "Modern concurrency model using Java Virtual Threads for superior performance.",
      "Decoupled, interface-driven design for high maintainability and extensibility.",
      "Professional-grade tooling with Maven for dependency management and SLF4J for logging."
    ],
    techStack: ['Java 21+', 'Project Loom', 'Maven', 'Systems Programming'],
    github: 'https://github.com/0bVdnt/Jerm.git'
  },
  {
    id: 'proj-cuda-gl',
    title: 'cuda-GL',
    shortDesc: 'Diving into parallel computing by building GPU-accelerated graphics components with CUDA and OpenGL.',
    thumbnail: '/assets/cudagl_thumb.png',
    fullDesc: `This project is a deep dive into high-performance, parallel computing by building graphics components
from scratch. It leverages the raw power of NVIDIA's CUDA platform for general-purpose GPU computations
and OpenGL for rendering. The goal is to explore the synergy between the two technologies for creating
real-time, computationally intensive visual applications.`,
    features: [
      "Directly explores GPGPU (General-Purpose GPU) programming with CUDA.",
      "Integrates CUDA compute kernels with an OpenGL rendering pipeline.",
      "Focuses on performance and understanding the modern graphics pipeline."
    ],
    techStack: ['CUDA', 'OpenGL', 'C++', 'HPC'],
    github: 'https://github.com/0bVdnt/cuda-GL.git'
  }
];
