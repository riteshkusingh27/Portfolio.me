import { useState } from 'react';
import { Minus, Square, X, ChevronRight, Terminal as TerminalIcon } from 'lucide-react';

type WindowType = 'portfolio' | 'terminal' | 'projects' | 'project-detail' | 'skills' | 'hireme';

interface Window {
  id: string;
  type: WindowType;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  data?: any;
}

export default function App() {
  const [windows, setWindows] = useState<Window[]>([
    {
      id: 'portfolio',
      type: 'portfolio',
      title: 'portfolio.txt - Notepad',
      icon: '📄',
      isMinimized: false,
      isMaximized: true,
      zIndex: 1,
      position: { x: 0, y: 0 }
    }
  ]);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Microsoft Windows 98 [Version 4.10.1998]',
    '(C) Copyright Microsoft Corp 1981-1998.',
    '',
    'Type "help" for list of commands.',
    ''
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [draggingWindow, setDraggingWindow] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  // Update time every minute and handle resize
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  });

  // Format time in IST
  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent, windowId: string) => {
    const target = e.target as HTMLElement;
    if (target.closest('.drag-handle')) {
      const win = windows.find(w => w.id === windowId);
      if (win && !win.isMaximized) {
        setDraggingWindow(windowId);
        setDragOffset({ 
          x: e.clientX - win.position.x, 
          y: e.clientY - win.position.y 
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingWindow) {
      setWindows(windows.map(w => 
        w.id === draggingWindow 
          ? { ...w, position: { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } } 
          : w
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggingWindow(null);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent, windowId: string) => {
    const target = e.target as HTMLElement;
    if (target.closest('.drag-handle')) {
      const win = windows.find(w => w.id === windowId);
      if (win && !win.isMaximized) {
        setTouchStart({
          x: e.touches[0].clientX - win.position.x,
          y: e.touches[0].clientY - win.position.y
        });
        setDraggingWindow(windowId);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggingWindow && touchStart) {
      setWindows(windows.map(w =>
        w.id === draggingWindow
          ? { ...w, position: { x: e.touches[0].clientX - touchStart.x, y: e.touches[0].clientY - touchStart.y } }
          : w
      ));
    }
  };

  const handleTouchEnd = () => {
    setDraggingWindow(null);
    setTouchStart(null);
  };

  const projects = [
    {
      id: 'cravecart',
      name: 'CraveCart',
      filename: 'CraveCart.app',
      icon: '🍔',
      description: `Built a scalable food delivery platform with secure payments and cloud-based storage.

📌 KEY FEATURES:
  • Designed full-stack food delivery application with seamless ordering
  • Implemented JWT-based authentication for secure API endpoints
  • Integrated AWS S3 for scalable and secure image storage
  • Enabled real-time payment processing with Razorpay gateway
  • Built responsive React frontend for smooth user experience`,
      tech: ['Spring Boot', 'React', 'MySQL', 'JWT', 'AWS S3'],
      impact: 'Secure payment integration & real-time order tracking',
      liveLink: 'https://cravecartjun.netlify.app/',
      githubLink: 'https://github.com/riteshkumarsingh/crave-cart',
    },
    {
      id: 'ordersystem',
      name: 'Order Management System',
      filename: 'OrderSystem.app',
      icon: '📦',
      description: `Built a resilient microservices system with event-driven architecture and fault tolerance.

📌 KEY FEATURES:
  • Developed microservices architecture for complete order lifecycle management
  • Implemented Spring Cloud Gateway for routing and centralized control
  • Integrated Kafka for asynchronous event-driven communication
  • Used Resilience4j for circuit breaking and system reliability
  • Implemented Zipkin for distributed tracing and performance monitoring`,
      tech: ['Microservices', 'Kafka', 'Resilience4j', 'Zipkin', 'Docker'],
      impact: 'High-performance distributed system with 99.9% uptime',
      githubLink: 'https://github.com/riteshkumarsingh/order-management-system',
    },
    {
      id: 'aimail',
      name: 'AI Mail Replier',
      filename: 'AIMailReplier.app',
      icon: '✉️',
      description: `Built an AI-powered email assistant that generates contextual replies directly inside Gmail.

📌 KEY FEATURES:
  • Developed Mozilla WebExtension (Manifest v3) for Gmail integration
  • Added AI-powered "Reply" button for contextual email responses
  • Processed email content through backend APIs for AI-generated replies
  • Improved productivity by automating email drafting
  • Seamless integration directly into Gmail interface`,
      tech: ['React', 'OpenAI API', 'Chrome Extension API', 'TypeScript'],
      impact: '10x faster email response time with AI-powered suggestions',
      liveLink: 'https://addons.mozilla.org/en-US/firefox/addon/ai-mail-replier/',
      githubLink: 'https://github.com/riteshkumarsingh/ai-mail-replier',
    },
    {
      id: 'blogr',
      name: 'Blogr',
      filename: 'Blogr.app',
      icon: '📝',
      description: `Developed an AI-driven blogging platform that generates structured content from user prompts.

📌 KEY FEATURES:
  • Built full-stack blogging platform with AI-powered content generation
  • Enabled users to generate structured blog drafts from simple prompts
  • Implemented end-to-end MERN architecture for seamless management
  • AI-powered content generation for accelerated blog creation
  • Integrated Gemini API for intelligent content suggestions`,
      tech: ['MERN', 'Gemini API', 'TailwindCSS'],
      impact: 'AI-powered content generation for seamless blog creation',
      liveLink: 'https://blogr-frontend-chi.vercel.app/',
      githubLink: 'https://github.com/riteshkumarsingh/blogr',
    },
    {
      id: 'gamingcafe',
      name: 'Gaming Cafe Management',
      filename: 'GamingCafe.app',
      icon: '🎮',
      description: `Delivered a full-stack production system for gaming café management with admin controls.

📌 KEY FEATURES:
  • Developed production-ready web application for gaming café operations
  • Built comprehensive admin dashboard for users, bookings, and events
  • Deployed on VPS for scalability and reliability
  • Real-time management system for 50+ daily customers
  • Delivered real-world solution tailored to business needs`,
      tech: ['Spring Boot', 'React', 'MySQL', 'JWT Auth'],
      impact: 'Streamlined operations for 50+ daily customers',
      liveLink: 'https://dsdpremiumgaming.com/',
      githubLink: 'https://github.com/riteshkumarsingh/gaming-cafe-management',
    },
  ];

  const openWindow = (type: WindowType, title: string, icon: string, data?: any) => {
    const existingWindow = windows.find(w => w.type === type && JSON.stringify(w.data) === JSON.stringify(data));
    if (existingWindow) {
      focusWindow(existingWindow.id);
      if (existingWindow.isMinimized) {
        toggleMinimize(existingWindow.id);
      }
      return;
    }

    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setWindows([...windows, {
      id: `${type}-${Date.now()}`,
      type,
      title,
      icon,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZIndex,
      position: { x: 200, y: 100 },
      data
    }]);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const toggleMinimize = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
  };

  const toggleMaximize = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const focusWindow = (id: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: newZIndex } : w));
  };

  const handleTerminalCommand = (command: string) => {
    const cmd = command.trim().toLowerCase();
    const newHistory = [...terminalHistory, `C:\\> ${command}`, ''];

    switch (cmd) {
      case 'help':
        newHistory.push(
          'Available commands:',
          '  projects  - View all projects',
          '  skills    - Show technical skills',
          '  hire      - Contact information',
          '  about     - About RITESH',
          '  clear     - Clear terminal',
          ''
        );
        break;
      case 'projects':
        newHistory.push('Opening projects folder...', '');
        openWindow('projects', 'Projects', '📁');
        break;
      case 'skills':
        newHistory.push('Opening Skills.exe...', '');
        openWindow('skills', 'Skills.exe', '🧠');
        break;
      case 'hire':
        newHistory.push('Opening HireMe.txt...', '');
        openWindow('hireme', 'HireMe.txt - Notepad', '💼');
        break;
      case 'about':
        newHistory.push(
          'RITESH - Java Backend Developer',
          '',
          'Specialization: Spring Boot | Microservices | Scalable Systems',
          'LeetCode: 200+ problems solved',
          'Status: Available for freelance & full-time',
          ''
        );
        break;
      case 'clear':
        setTerminalHistory([
          'Microsoft Windows 98 [Version 4.10.1998]',
          '(C) Copyright Microsoft Corp 1981-1998.',
          '',
          'Type "help" for list of commands.',
          ''
        ]);
        return;
      case '':
        break;
      default:
        newHistory.push(`'${command}' is not recognized as an internal or external command.`, '');
    }

    setTerminalHistory(newHistory);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderWindowContent = (window: Window) => {
    switch (window.type) {
      case 'portfolio':
        return (
          <>
            <div className="bg-[#F0F0F0] border-b border-[#808080] px-2 py-1 flex gap-4 text-sm select-none">
              <button className="hover:bg-[#0000AA] hover:text-white px-2" onClick={() => scrollToSection('hero')}>File</button>
              <button className="hover:bg-[#0000AA] hover:text-white px-2" onClick={() => scrollToSection('projects')}>View</button>
              <button className="hover:bg-[#0000AA] hover:text-white px-2" onClick={() => scrollToSection('about')}>Edit</button>
              <button className="hover:bg-[#0000AA] hover:text-white px-2" onClick={() => scrollToSection('contact')}>Help</button>
            </div>
            <div className="p-6 text-black overflow-y-auto md:h-[500px] h-[calc(100vh-120px)]" style={{ fontFamily: 'Courier New, monospace' }}>
              <section id="hero" className="mb-8">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap">
{`╔═══════════════════════════════════════════════════════════════════╗
║   ██████╗ ████████╗███████╗███████╗██╗  ██╗                      ║
║   ██╔══██╗╚══██╔══╝██╔════╝██╔════╝██║  ██║                      ║
║   ██████╔╝   ██║   █████╗  ███████╗███████║                      ║
║   ██╔══██╗   ██║   ██╔══╝  ╚════██║██╔══██║                      ║
║   ██║  ██║   ██║   ███████╗███████║██║  ██║                      ║
║   ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝                      ║
╚═══════════════════════════════════════════════════════════════════╝

Java Backend Developer
Spring Boot | Microservices | Scalable Systems

PROFILE LINKS:`}
                </pre>
                <div className="text-sm ml-0" style={{ fontFamily: 'Courier New, monospace' }}>
                  <span>├─ GitHub: </span>
                  <a href="https://github.com/riteshkusingh27" target="_blank" rel="noopener noreferrer"
                    className="text-[#0000EE] underline hover:text-[#551A8B] visited:text-[#551A8B]">
                    github.com/riteshkusingh27
                  </a><br />
                  <span>├─ LeetCode: </span>
                  <a href="https://leetcode.com/u/ritttxr256/" target="_blank" rel="noopener noreferrer"
                    className="text-[#0000EE] underline hover:text-[#551A8B] visited:text-[#551A8B]">
                    leetcode.com/u/ritttxr256/
                  </a><br />
                  <span>└─ LinkedIn: </span>
                  <a href="https://www.linkedin.com/in/riteshkusingh/" target="_blank" rel="noopener noreferrer"
                    className="text-[#0000EE] underline hover:text-[#551A8B] visited:text-[#551A8B]">
                    linkedin.com/in/riteshkusingh/
                  </a>
                </div>
                <pre className="text-sm leading-relaxed whitespace-pre-wrap mt-2">
{`
STATISTICS:
├─ LeetCode Problems: 200+
├─ Projects: 10+
└─ Uptime: 99.9%`}
                </pre>
              </section>

              <section id="about" className="mb-8">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap">
{`
═══════════════════════════════════════════════════════════════════
ABOUT ME
═══════════════════════════════════════════════════════════════════

I'm RITESH, a passionate Java Backend Developer with expertise in 
building scalable, high-performance web applications. 

Strong foundation in DSA with 200+ LeetCode problems solved.
Specialized in Spring Boot microservices architecture.
Real-world production experience with freelance projects.

═══════════════════════════════════════════════════════════════════`}
                </pre>
              </section>

              <section id="contact">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap">
{`
═══════════════════════════════════════════════════════════════════
CONTACT
═══════════════════════════════════════════════════════════════════

Name: RITESH
Role: Java Backend Developer | Full-Stack Developer

EMAIL: `}
                </pre>
                <a href="mailto:ritesh@example.com"
                  className="text-[#0000EE] underline hover:text-[#551A8B] visited:text-[#551A8B] text-sm">
                  ritesh@example.com
                </a>
                <pre className="text-sm leading-relaxed whitespace-pre-wrap inline">{`
PHONE: +91 98765 43210

© 2026 RITESH. All rights reserved.`}
                </pre>
              </section>
            </div>
            <div className="bg-[#C0C0C0] border-t-2 border-t-[#808080] border-b-white px-2 py-1 text-xs select-none">
              <div className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white px-3 py-1 inline-block">
                Windows
              </div>
            </div>
          </>
        );

      case 'terminal':
        return (
          <div className="bg-black p-4 md:h-[500px] h-[calc(100vh-120px)] overflow-y-auto font-mono text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
            <div className="text-green-400">
              {terminalHistory.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              <div className="flex items-center">
                <span className="text-green-400">C:\&gt; </span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTerminalCommand(terminalInput);
                      setTerminalInput('');
                    }
                  }}
                  className="flex-1 bg-transparent text-green-400 outline-none ml-1"
                  autoFocus
                />
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="bg-white p-6 md:h-[500px] h-[calc(100vh-120px)] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => openWindow('project-detail', project.name, project.icon, project)}
                  onDoubleClick={() => openWindow('project-detail', project.name, project.icon, project)}
                  className="flex flex-col items-center gap-2 p-4 hover:bg-[#0000AA]/10 border-2 border-transparent focus:border-dotted focus:border-black"
                >
                  <div className="text-6xl">{project.icon}</div>
                  <span className="text-sm text-center">{project.filename}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'project-detail':
        const project = window.data;
        return (
          <div className="bg-white p-6 md:h-[500px] h-[calc(100vh-120px)] overflow-y-auto" style={{ fontFamily: 'Courier New, monospace' }}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{project.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-bold mb-1">DESCRIPTION:</div>
                <div className="whitespace-pre-line">{project.description}</div>
              </div>

              <div>
                <div className="font-bold mb-1">TECH STACK:</div>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech: string) => (
                    <span key={tech} className="px-2 py-1 bg-[#C0C0C0] border border-[#808080]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold mb-1">IMPACT:</div>
                <div>{project.impact}</div>
              </div>

              <div className="pt-4 border-t border-[#808080] space-y-2">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-3 bg-[#C0C0C0] border-2 border-t-white border-l-white border-r-[#000] border-b-[#000] text-center hover:bg-[#DFDFDF] active:border-t-[#000] active:border-l-[#000] active:border-r-white active:border-b-white"
                  >
                    🌐 Run Live Demo
                  </a>
                )}
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-3 bg-[#C0C0C0] border-2 border-t-white border-l-white border-r-[#000] border-b-[#000] text-center hover:bg-[#DFDFDF] active:border-t-[#000] active:border-l-[#000] active:border-r-white active:border-b-white"
                >
                  💻 View Source Code
                </a>
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <>
            <div className="bg-[#F0F0F0] border-b border-[#808080] px-2 py-1 text-sm select-none font-bold">
              System Information
            </div>
            <div className="bg-white p-6 md:h-[500px] h-[calc(100vh-120px)] overflow-y-auto" style={{ fontFamily: 'Courier New, monospace' }}>
              <pre className="text-sm">
{`╔═══════════════════════════════════════╗
║        TECHNICAL SKILLS v1.0          ║
╚═══════════════════════════════════════╝

[BACKEND]
├─ Java ██████████��█████████ 95%
├─ Spring Boot ████████████████ 90%
├─ Microservices ██████████████ 85%
└─ REST APIs ███████████████████ 92%

[FRONTEND]
├─ React ████████████████ 85%
├─ Tailwind CSS ████████████████ 88%
├─ JavaScript ███████████████ 87%
└─ TypeScript ██████████████ 82%

[DATABASES]
├─ MySQL ████████████████████ 90%
├─ MongoDB ███████████████ 85%
├─ PostgreSQL ██████████████ 80%
└─ Redis ████████████ 75%

[TOOLS & CLOUD]
├─ Docker ███████████████ 85%
├─ Kafka ██████████████ 80%
├─ AWS S3 ███████████████ 83%
├─ GitHub ████████████████████ 95%
└─ Zipkin ████████████ 78%

[PROBLEM SOLVING]
├─ LeetCode: 200+ problems
├─ DSA: Strong foundation
└─ Algorithms: Expert level

System Status: Operational ✓
Last Updated: April 2026`}
              </pre>
            </div>
          </>
        );

      case 'hireme':
        return (
          <>
            <div className="bg-[#F0F0F0] border-b border-[#808080] px-2 py-1 flex gap-4 text-sm select-none">
              <button className="hover:bg-[#0000AA] hover:text-white px-2">File</button>
              <button className="hover:bg-[#0000AA] hover:text-white px-2">Edit</button>
            </div>
            <div className="p-6 text-black overflow-y-auto md:h-[500px] h-[calc(100vh-120px)]" style={{ fontFamily: 'Courier New, monospace' }}>
              <pre className="text-sm leading-relaxed whitespace-pre-wrap">
{`╔═══════════════════════════════════════════════════════════════════╗
║                      WHY HIRE ME?                                 ║
╚═══════════════════════════════════════════════════════════════════╝

[✓] SCALABLE BACKEND ARCHITECTURE
    Expert in building robust Spring Boot microservices that 
    handle thousands of concurrent requests

[✓] SECURE API DEVELOPMENT
    JWT authentication, OAuth integration, and enterprise-grade 
    security practices

[✓] FULL-STACK CAPABILITY
    Seamless integration of React frontends with Java backend 
    systems

[✓] PRODUCTION EXPERIENCE
    Real-world freelance projects and hands-on deployment 
    experience

══════════════════════════════════════════════════════════════════

CONTACT INFORMATION:

Email: `}
              </pre>
              <a href="mailto:ritesh@example.com"
                className="text-[#0000EE] underline hover:text-[#551A8B] visited:text-[#551A8B] text-sm">
                ritesh@example.com
              </a>
              <pre className="text-sm leading-relaxed whitespace-pre-wrap inline">
{`
Phone: +91 98765 43210

GitHub: `}
              </pre>
              <a href="https://github.com/riteshkusingh27" target="_blank" rel="noopener noreferrer"
                className="text-[#0000EE] underline hover:text-[#551A8B] visited:text-[#551A8B] text-sm">
                github.com/riteshkusingh27
              </a>
              <pre className="text-sm leading-relaxed whitespace-pre-wrap">
{`
LinkedIn: `}
              </pre>
              <a href="https://www.linkedin.com/in/riteshkusingh/" target="_blank" rel="noopener noreferrer"
                className="text-[#0000EE] underline hover:text-[#551A8B] visited:text-[#551A8B] text-sm">
                linkedin.com/in/riteshkusingh/
              </a>
              <pre className="text-sm leading-relaxed whitespace-pre-wrap">
{`

═══════════════════════════════════════════════════════════════════

I help businesses build fast, secure, and scalable web 
applications.

Ready to discuss your next project?
Let's connect!`}
              </pre>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1a1a2e] min-h-screen font-mono select-text relative overflow-hidden">
      {/* Background Text */}
      <div className={`fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0 ${isMobile ? 'pr-4' : 'pr-32'}`}>
        <div className="text-center">
          <h1 className={`${isMobile ? 'text-3xl' : 'text-6xl'} font-black mb-4 text-yellow-400 opacity-20`} style={{ 
            fontFamily: 'Orbitron, sans-serif', 
            letterSpacing: isMobile ? '0.05em' : '0.15em',
            fontWeight: 900,
            textShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
          }}>
            RITESH KUMAR SINGH
          </h1>
          <p className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold text-yellow-300 opacity-25`} style={{ 
            fontFamily: 'Orbitron, sans-serif', 
            letterSpacing: isMobile ? '0.15em' : '0.3em',
            fontWeight: 700,
            textShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
          }}>
            riteshkusingh27@gmail.com || +919148969152
          </p>
        </div>
      </div>

      <div className="min-h-screen p-4 pb-12 relative z-10">
        
        {/* Desktop Icons */}
        <div className={`${isMobile ? 'flex flex-wrap gap-3 justify-start mb-4' : 'grid gap-4 w-24'}`}>
          <button
            onClick={() => openWindow('portfolio', 'portfolio.txt - Notepad', '📄')}
            onDoubleClick={() => openWindow('portfolio', 'portfolio.txt - Notepad', '📄')}
            className={`flex flex-col items-center gap-1 p-2 hover:bg-[#0000AA]/20 border-2 border-transparent focus:border-dotted focus:border-white active:bg-[#0000AA]/40 transition-all duration-100 ${isMobile ? 'w-16 md:w-24' : ''}`}
          >
            <div className={`transition-transform duration-100 active:scale-90 ${isMobile ? 'text-2xl md:text-4xl' : 'text-4xl'}`}>📄</div>
            <span className={`text-white text-center drop-shadow-[1px_1px_0_rgba(0,0,0,1)] ${isMobile ? 'text-[10px] md:text-xs' : 'text-xs'}`}>portfolio.txt</span>
          </button>

          <button
            onClick={() => openWindow('projects', 'Projects', '📁')}
            onDoubleClick={() => openWindow('projects', 'Projects', '📁')}
            className={`flex flex-col items-center gap-1 p-2 hover:bg-[#0000AA]/20 border-2 border-transparent focus:border-dotted focus:border-white active:bg-[#0000AA]/40 transition-all duration-100 ${isMobile ? 'w-16 md:w-24' : ''}`}
          >
            <div className={`transition-transform duration-100 active:scale-90 ${isMobile ? 'text-2xl md:text-4xl' : 'text-4xl'}`}>📁</div>
            <span className={`text-white text-center drop-shadow-[1px_1px_0_rgba(0,0,0,1)] ${isMobile ? 'text-[10px] md:text-xs' : 'text-xs'}`}>Projects</span>
          </button>

          <button
            onClick={() => openWindow('skills', 'Skills.exe', '🧠')}
            onDoubleClick={() => openWindow('skills', 'Skills.exe', '🧠')}
            className={`flex flex-col items-center gap-1 p-2 hover:bg-[#0000AA]/20 border-2 border-transparent focus:border-dotted focus:border-white active:bg-[#0000AA]/40 transition-all duration-100 ${isMobile ? 'w-16 md:w-24' : ''}`}
          >
            <div className={`transition-transform duration-100 active:scale-90 ${isMobile ? 'text-2xl md:text-4xl' : 'text-4xl'}`}>🧠</div>
            <span className={`text-white text-center drop-shadow-[1px_1px_0_rgba(0,0,0,1)] ${isMobile ? 'text-[10px] md:text-xs' : 'text-xs'}`}>Skills.exe</span>
          </button>

          <button
            onClick={() => openWindow('hireme', 'HireMe.txt - Notepad', '💼')}
            onDoubleClick={() => openWindow('hireme', 'HireMe.txt - Notepad', '💼')}
            className={`flex flex-col items-center gap-1 p-2 hover:bg-[#0000AA]/20 border-2 border-transparent focus:border-dotted focus:border-white active:bg-[#0000AA]/40 transition-all duration-100 ${isMobile ? 'w-16 md:w-24' : ''}`}
          >
            <div className={`transition-transform duration-100 active:scale-90 ${isMobile ? 'text-2xl md:text-4xl' : 'text-4xl'}`}>💼</div>
            <span className={`text-white text-center drop-shadow-[1px_1px_0_rgba(0,0,0,1)] ${isMobile ? 'text-[10px] md:text-xs' : 'text-xs'}`}>HireMe.txt</span>
          </button>

          <button
            onClick={() => openWindow('terminal', 'Terminal', '🖥️')}
            onDoubleClick={() => openWindow('terminal', 'Terminal', '🖥️')}
            className={`flex flex-col items-center gap-1 p-2 hover:bg-[#0000AA]/20 border-2 border-transparent focus:border-dotted focus:border-white active:bg-[#0000AA]/40 transition-all duration-100 ${isMobile ? 'w-16 md:w-24' : ''}`}
          >
            <div className={`transition-transform duration-100 active:scale-90 ${isMobile ? 'text-2xl md:text-4xl' : 'text-4xl'}`}>🖥️</div>
            <span className={`text-white text-center drop-shadow-[1px_1px_0_rgba(0,0,0,1)] ${isMobile ? 'text-[10px] md:text-xs' : 'text-xs'}`}>Terminal.exe</span>
          </button>

          <button className={`flex flex-col items-center gap-1 p-2 hover:bg-[#0000AA]/20 border-2 border-transparent focus:border-dotted focus:border-white active:bg-[#0000AA]/40 transition-all duration-100 ${isMobile ? 'w-16 md:w-24' : ''}`}>
            <div className={`transition-transform duration-100 active:scale-90 ${isMobile ? 'text-2xl md:text-4xl' : 'text-4xl'}`}>🗑️</div>
            <span className={`text-white text-center drop-shadow-[1px_1px_0_rgba(0,0,0,1)] ${isMobile ? 'text-[10px] md:text-xs' : 'text-xs'}`}>Recycle Bin</span>
          </button>
        </div>

        {/* Windows */}
        {windows.map(window => (
          !window.isMinimized && (
            <div
              key={window.id}
              className={`bg-white border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] ${
                window.isMaximized 
                  ? 'fixed top-0 left-0 right-0 bottom-10 m-0' 
                  : isMobile ? 'fixed inset-0 m-4 rounded' : 'absolute w-[800px] max-w-[90vw]'
              }`}
              style={{
                zIndex: window.zIndex,
                top: window.isMaximized ? 0 : `${window.position.y}px`,
                left: window.isMaximized ? 0 : `${window.position.x}px`,
              }}
              onClick={() => focusWindow(window.id)}
              onMouseDown={(e) => handleMouseDown(e, window.id)}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={(e) => handleTouchStart(e, window.id)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Title Bar */}
              <div className="bg-gradient-to-r from-[#0000AA] to-[#1084D0] px-2 py-1 flex items-center justify-between select-none cursor-move drag-handle">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-black flex items-center justify-center text-[10px]">
                    {window.icon}
                  </div>
                  <span className="text-white text-sm">{window.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMinimize(window.id);
                    }}
                    className="w-5 h-5 bg-[#C0C0C0] border border-t-white border-l-white border-r-[#000] border-b-[#000] flex items-center justify-center hover:bg-[#DFDFDF] active:border-t-[#000] active:border-l-[#000] active:border-r-white active:border-b-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMaximize(window.id);
                    }}
                    className="w-5 h-5 bg-[#C0C0C0] border border-t-white border-l-white border-r-[#000] border-b-[#000] flex items-center justify-center hover:bg-[#DFDFDF] active:border-t-[#000] active:border-l-[#000] active:border-r-white active:border-b-white"
                  >
                    <Square className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeWindow(window.id);
                    }}
                    className="w-5 h-5 bg-[#C0C0C0] border border-t-white border-l-white border-r-[#000] border-b-[#000] flex items-center justify-center hover:bg-[#DFDFDF] active:border-t-[#000] active:border-l-[#000] active:border-r-white active:border-b-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Window Content */}
              {renderWindowContent(window)}
            </div>
          )
        ))}

        {/* Taskbar */}
        <div className={`fixed bottom-0 left-0 right-0 bg-[#C0C0C0] border-t-2 border-t-white border-b-[#808080] ${isMobile ? 'px-1 py-2' : 'px-2 py-1'} flex items-center gap-2 select-none z-50`}>
          <div className="relative">
            <button
              className={`bg-[#008080] hover:bg-[#009090] border-2 border-t-white border-l-white border-r-[#000] border-b-[#000] ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-1 text-sm'} flex items-center gap-2 text-white font-bold active:border-t-[#000] active:border-l-[#000] active:border-r-white active:border-b-white`}
              onClick={() => setShowStartMenu(!showStartMenu)}
            >
              <span className="text-base">🪟</span>
              <span className={isMobile ? 'hidden sm:inline' : ''}>Start</span>
            </button>
            {showStartMenu && (
              <div className={`absolute ${isMobile ? 'w-screen sm:w-64 left-0 sm:left-auto sm:bottom-full' : 'w-64 left-0 bottom-full'} mb-1 bg-[#C0C0C0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] z-50 max-h-96 overflow-y-auto`}>
                {/* Start Menu Sidebar */}
                <div className="flex">
                  <div className="bg-gradient-to-b from-[#0000AA] to-[#1084D0] w-8 flex items-end py-2">
                    <span className="text-white font-bold text-xs transform -rotate-90 origin-bottom-left translate-y-6 translate-x-6 whitespace-nowrap">
                      Windows <span className="text-[10px]">98</span>
                    </span>
                  </div>
                  <div className="flex-1">
                    {/* Menu Items */}
                    <button
                      onClick={() => {
                        openWindow('portfolio', 'portfolio.txt - Notepad', '📄');
                        setShowStartMenu(false);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#0000AA] hover:text-white text-left text-sm"
                    >
                      <span className="text-lg">📄</span>
                      <span>Portfolio</span>
                    </button>
                    <button
                      onClick={() => {
                        openWindow('projects', 'Projects', '📁');
                        setShowStartMenu(false);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#0000AA] hover:text-white text-left text-sm"
                    >
                      <span className="text-lg">📁</span>
                      <span>Projects</span>
                    </button>
                    <button
                      onClick={() => {
                        openWindow('skills', 'Skills.exe', '🧠');
                        setShowStartMenu(false);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#0000AA] hover:text-white text-left text-sm"
                    >
                      <span className="text-lg">🧠</span>
                      <span>Skills</span>
                    </button>
                    <button
                      onClick={() => {
                        openWindow('hireme', 'HireMe.txt - Notepad', '💼');
                        setShowStartMenu(false);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#0000AA] hover:text-white text-left text-sm"
                    >
                      <span className="text-lg">💼</span>
                      <span>Hire Me</span>
                    </button>
                    <button
                      onClick={() => {
                        openWindow('terminal', 'Terminal', '🖥️');
                        setShowStartMenu(false);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#0000AA] hover:text-white text-left text-sm"
                    >
                      <span className="text-lg">🖥️</span>
                      <span>Terminal</span>
                    </button>
                    
                    <div className="h-[2px] bg-[#808080] my-1 mx-2"></div>
                    
                    {/* Profile Links */}
                    <a
                      href="https://github.com/riteshkumarsingh"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowStartMenu(false)}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#0000AA] hover:text-white text-left text-sm"
                    >
                      <span className="text-lg">💻</span>
                      <span>GitHub</span>
                    </a>
                    <a
                      href="https://leetcode.com/riteshkumarsingh"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowStartMenu(false)}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#0000AA] hover:text-white text-left text-sm"
                    >
                      <span className="text-lg">🧩</span>
                      <span>LeetCode</span>
                    </a>
                    <a
                      href="https://linkedin.com/in/riteshkumarsingh"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowStartMenu(false)}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#0000AA] hover:text-white text-left text-sm"
                    >
                      <span className="text-lg">💼</span>
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`flex-1 bg-[#808080] ${isMobile ? 'h-6' : 'h-8'} border-2 border-t-[#000] border-l-[#000] border-r-white border-b-white px-2 py-1 flex items-center gap-2 overflow-x-auto`}>
            {windows.map(window => (
              <button
                key={window.id}
                onClick={() => {
                  if (window.isMinimized) {
                    toggleMinimize(window.id);
                  }
                  focusWindow(window.id);
                }}
                className={`${!window.isMinimized ? 'bg-[#C0C0C0]' : 'bg-transparent'} border border-[#808080] ${isMobile ? 'px-2 py-0 text-xs' : 'px-3 py-1 text-xs'} flex items-center gap-1 hover:bg-[#C0C0C0] transition-colors whitespace-nowrap`}
              >
                <span>{window.icon}</span>
                <span>{window.title}</span>
              </button>
            ))}
          </div>
          <div className={`border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white ${isMobile ? 'px-2 py-0' : 'px-3 py-1'} text-xs flex items-center gap-1`}>
            <span>🔊</span>
            <span className={isMobile ? 'hidden md:inline' : ''}>{formatTime()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}