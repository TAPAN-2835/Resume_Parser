import { ResumeNormalizer } from '../lib/parser/resume-normalizer';

const sampleResume = `
JOHN DOE
john.doe@example.com | (555) 123-4567
linkedin.com/in/johndoe | github.com/johndoe
San Francisco, CA

EXPERIENCE
Senior Software Engineer at Tech Corp
2021 - Present
- Led a team of 10 engineers to build a scalable microservices architecture.
- Improved system performance by 40% and reduced latency by 100ms.
- Architected the frontend using React and Next.js.

Software Developer at Startup Inc
2018 - 2021
- Developed real-time collaboration features using WebSockets.
- Integrated payment gateways (Stripe, PayPal) for 50k monthly active users.

SKILLS
JavaScript, TypeScript, React, Node.js, AWS, Docker, Kubernetes
Leadership, Problem Solving, Agile, Communication

EDUCATION
Master of Science in Computer Science
Stanford University, 2018

Bachelor of Science in Software Engineering
State University, 2016
`;

const normalizer = new ResumeNormalizer(sampleResume);
const result = normalizer.normalize();

console.log('--- Parsed Resume Data ---');
console.log(JSON.stringify(result, null, 2));
