require('dotenv').config();
const mongoose = require('mongoose');
const {
  User, Project, Blog, Certification, Skill, Service,
  Testimonial, FAQ, Profile, Settings
} = require('../models');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear collections
  await Promise.all([
    User.deleteMany({}), Project.deleteMany({}), Blog.deleteMany({}),
    Certification.deleteMany({}), Skill.deleteMany({}), Service.deleteMany({}),
    Testimonial.deleteMany({}), FAQ.deleteMany({}), Profile.deleteMany({})
  ]);
  console.log('Cleared collections');

  // Admin user
  await User.create({
    username: 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@cyberfolio.dev',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    role: 'admin'
  });
  console.log('Admin user created');

  // Profile
  await Profile.create({
    name: 'Alex Cipher',
    title: 'Senior Penetration Tester & Security Researcher',
    tagline: 'Breaking systems to make them stronger.',
    bio: 'Passionate cybersecurity professional with 7+ years of experience in penetration testing, vulnerability research, and red team operations. I specialize in web application security, network security, and advanced threat emulation.',
    shortBio: 'Senior Penetration Tester with expertise in red teaming, exploit development, and security research.',
    availability: 'available',
    yearsExperience: 7,
    projectsCompleted: 150,
    clientsSatisfied: 80,
    location: 'Remote / Worldwide',
    email: 'contact@alexcipher.dev',
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      hackerone: 'https://hackerone.com',
      bugcrowd: 'https://bugcrowd.com',
      tryhackme: 'https://tryhackme.com',
      hackthebox: 'https://hackthebox.com'
    },
    seo: {
      title: 'Alex Cipher - Cybersecurity Expert & Penetration Tester',
      description: 'Professional cybersecurity portfolio showcasing penetration testing, security research, and red team operations.',
      keywords: ['cybersecurity', 'penetration testing', 'ethical hacking', 'security researcher']
    }
  });

  // Skills
  const skillsData = [
    { name: 'Web Application Pentesting', category: 'Offensive Security', proficiency: 95, color: '#00ff88', order: 1 },
    { name: 'Network Penetration Testing', category: 'Offensive Security', proficiency: 92, color: '#00ff88', order: 2 },
    { name: 'Active Directory Attacks', category: 'Offensive Security', proficiency: 88, color: '#00ff88', order: 3 },
    { name: 'Exploit Development', category: 'Offensive Security', proficiency: 80, color: '#00ff88', order: 4 },
    { name: 'Malware Analysis', category: 'Defensive Security', proficiency: 85, color: '#00d4ff', order: 5 },
    { name: 'Threat Hunting', category: 'Defensive Security', proficiency: 82, color: '#00d4ff', order: 6 },
    { name: 'SIEM & Log Analysis', category: 'Defensive Security', proficiency: 78, color: '#00d4ff', order: 7 },
    { name: 'Python', category: 'Programming', proficiency: 90, color: '#a855f7', order: 8 },
    { name: 'Bash / Shell Scripting', category: 'Programming', proficiency: 88, color: '#a855f7', order: 9 },
    { name: 'C / C++', category: 'Programming', proficiency: 72, color: '#a855f7', order: 10 },
    { name: 'AWS Security', category: 'Cloud Security', proficiency: 80, color: '#f59e0b', order: 11 },
    { name: 'Docker / Kubernetes Security', category: 'Cloud Security', proficiency: 75, color: '#f59e0b', order: 12 }
  ];
  await Skill.insertMany(skillsData);

  // Certifications
  await Certification.insertMany([
    { name: 'Offensive Security Certified Professional', issuer: 'Offensive Security', credentialId: 'OS-101-XXXXX', issueDate: new Date('2022-03-15'), image: '', category: 'offensive', featured: true, order: 1 },
    { name: 'Certified Ethical Hacker', issuer: 'EC-Council', credentialId: 'ECC-XXXXX', issueDate: new Date('2021-06-20'), expiryDate: new Date('2024-06-20'), image: '', category: 'offensive', featured: true, order: 2 },
    { name: 'CompTIA Security+', issuer: 'CompTIA', credentialId: 'COMP001XXXXX', issueDate: new Date('2020-09-10'), image: '', category: 'defensive', featured: false, order: 3 },
    { name: 'AWS Certified Security Specialty', issuer: 'Amazon Web Services', credentialId: 'AWS-XXX-XXXXX', issueDate: new Date('2023-01-22'), image: '', category: 'cloud', featured: true, order: 4 }
  ]);

  // Services
  await Service.insertMany([
    {
      title: 'Web Application Penetration Testing',
      slug: 'web-app-pentest',
      description: 'Comprehensive security assessment of web applications identifying vulnerabilities like SQL injection, XSS, IDOR, and business logic flaws.',
      icon: 'globe',
      features: ['OWASP Top 10 testing', 'API security assessment', 'Authentication bypass', 'Business logic testing', 'Detailed remediation report'],
      featured: true, order: 1,
      pricing: {
        basic: { name: 'Basic', price: 500, features: ['Up to 10 endpoints', 'OWASP Top 10', 'PDF report'], highlighted: false },
        standard: { name: 'Standard', price: 1500, features: ['Up to 50 endpoints', 'Full API testing', 'HTML + PDF report', 'Retest included'], highlighted: true },
        premium: { name: 'Enterprise', price: 4000, features: ['Unlimited endpoints', 'Source code review', 'Priority support', '2 retests'], highlighted: false }
      }
    },
    {
      title: 'Network Penetration Testing',
      slug: 'network-pentest',
      description: 'Internal and external network security assessments to identify vulnerabilities in infrastructure, services, and configurations.',
      icon: 'network',
      features: ['External attack simulation', 'Internal network assessment', 'Firewall rule review', 'VPN security testing', 'Executive summary'],
      featured: true, order: 2
    },
    {
      title: 'Red Team Operations',
      slug: 'red-team',
      description: 'Full-scope adversarial simulations mimicking real-world threat actors to test your organization\'s detection and response capabilities.',
      icon: 'shield-x',
      features: ['Physical intrusion testing', 'Social engineering', 'C2 infrastructure', 'Lateral movement', 'Full chain of custody report'],
      featured: true, order: 3
    },
    {
      title: 'Security Code Review',
      slug: 'code-review',
      description: 'Manual and automated source code review to identify security vulnerabilities before they reach production.',
      icon: 'code',
      features: ['SAST integration', 'Manual code analysis', 'Framework-specific checks', 'CI/CD pipeline review', 'Developer training'],
      featured: false, order: 4
    }
  ]);

  // Projects
  await Project.insertMany([
    {
      title: 'CVE-2023-XXXXX: RCE in Popular CMS',
      slug: 'rce-vulnerability-cms',
      description: 'Discovered and responsibly disclosed a critical remote code execution vulnerability in a widely used CMS platform affecting 500,000+ installations.',
      category: 'research',
      tags: ['CVE', 'RCE', 'PHP', 'Disclosure'],
      technologies: ['PHP', 'Burp Suite', 'Python', 'Metasploit'],
      featured: true, status: 'published', difficulty: 'expert',
      completedAt: new Date('2023-08-10'), order: 1
    },
    {
      title: 'Active Directory Red Team Lab',
      slug: 'ad-redteam-lab',
      description: 'Built a comprehensive Active Directory attack and defense lab demonstrating Kerberoasting, Pass-the-Hash, DCSync, and defense evasion techniques.',
      category: 'tool',
      tags: ['Active Directory', 'Red Team', 'Kerberos', 'Windows'],
      technologies: ['PowerShell', 'Impacket', 'BloodHound', 'Mimikatz'],
      githubUrl: 'https://github.com',
      featured: true, status: 'published', difficulty: 'advanced',
      completedAt: new Date('2023-05-20'), order: 2
    },
    {
      title: 'Automated Bug Bounty Recon Framework',
      slug: 'recon-framework',
      description: 'Developed a Python-based reconnaissance automation framework for bug bounty programs, integrating 15+ tools with intelligent deduplication.',
      category: 'tool',
      tags: ['Bug Bounty', 'Recon', 'Python', 'Automation'],
      technologies: ['Python', 'Shodan', 'subfinder', 'httpx', 'Docker'],
      githubUrl: 'https://github.com',
      featured: true, status: 'published', difficulty: 'intermediate',
      completedAt: new Date('2023-02-15'), order: 3
    }
  ]);

  // Blog posts
  await Blog.insertMany([
    {
      title: 'Breaking SSRF Filters: Advanced Techniques for Bug Hunters',
      slug: 'breaking-ssrf-filters',
      excerpt: 'Deep dive into Server-Side Request Forgery bypass techniques that go beyond the basics — IPv6 encoding, DNS rebinding, and cloud metadata exploitation.',
      content: '<p>Server-Side Request Forgery (SSRF) remains one of the most impactful vulnerabilities in modern web applications...</p><p>In this post, we explore advanced bypass techniques that security researchers can use to test SSRF protections...</p>',
      category: 'Web Security',
      tags: ['SSRF', 'Bug Bounty', 'Web Security', 'OWASP'],
      status: 'published',
      featured: true,
      publishedAt: new Date('2024-01-10'),
      readingTime: 8
    },
    {
      title: 'Active Directory Persistence Mechanisms Defenders Need to Know',
      slug: 'ad-persistence-mechanisms',
      excerpt: 'A red teamer\'s guide to AD persistence — Golden Tickets, Silver Tickets, DSRM abuse, and AdminSDHolder manipulation.',
      content: '<p>Active Directory persistence is a critical area that every defender needs to understand from an attacker\'s perspective...</p>',
      category: 'Active Directory',
      tags: ['Active Directory', 'Red Team', 'Persistence', 'Windows'],
      status: 'published',
      featured: false,
      publishedAt: new Date('2023-12-15'),
      readingTime: 12
    }
  ]);

  // Testimonials
  await Testimonial.insertMany([
    {
      name: 'Sarah Mitchell',
      title: 'CTO',
      company: 'FinTech Solutions Inc.',
      content: 'The penetration test uncovered 3 critical vulnerabilities that our internal team missed. The report was thorough, actionable, and the remediation support was exceptional.',
      rating: 5, approved: true, featured: true, order: 1
    },
    {
      name: 'Marcus Chen',
      title: 'Head of IT Security',
      company: 'HealthCare Systems Ltd.',
      content: 'Outstanding red team engagement. The team simulated a realistic APT scenario and helped us completely overhaul our incident response process.',
      rating: 5, approved: true, featured: true, order: 2
    },
    {
      name: 'Elena Vasquez',
      title: 'CISO',
      company: 'E-Commerce Platform',
      content: 'Discovered a SQL injection vulnerability that could have exposed our entire customer database. Fast, professional, and highly skilled.',
      rating: 5, approved: true, featured: false, order: 3
    }
  ]);

  // FAQs
  await FAQ.insertMany([
    { question: 'What types of penetration testing do you offer?', answer: 'I offer web application, network, mobile, API, and red team penetration testing services tailored to your needs and compliance requirements.', category: 'services', order: 1 },
    { question: 'Do you sign NDAs before engagements?', answer: 'Absolutely. A mutual NDA is standard for all engagements to protect both parties. I can sign your template or provide my own.', category: 'general', order: 2 },
    { question: 'How long does a typical penetration test take?', answer: 'Duration depends on scope. A focused web app test can take 3-5 days, while comprehensive red team engagements can run 2-4 weeks.', category: 'services', order: 3 },
    { question: 'Do you provide remediation support?', answer: 'Yes. All engagements include a retest after remediation to confirm fixes are effective. I also offer developer workshops.', category: 'services', order: 4 },
    { question: 'What reporting formats do you provide?', answer: 'Reports include an executive summary for management and a detailed technical section with CVSS scores, reproduction steps, and remediation guidance.', category: 'general', order: 5 }
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('Admin credentials:');
  console.log('  Email:', process.env.ADMIN_EMAIL || 'admin@cyberfolio.dev');
  console.log('  Password:', process.env.ADMIN_PASSWORD || 'Admin@12345');
  await mongoose.disconnect();
};

seed().catch(err => { console.error(err); process.exit(1); });
