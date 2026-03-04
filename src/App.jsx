import { useState, useEffect, useCallback } from "react";
import {
  ChevronRight, ChevronLeft, Plus, Trash2, Download,
  Sparkles, User, Briefcase, GraduationCap, Award,
  Code, FileText, AlignLeft, Loader2, CheckCircle2,
  AlertCircle, RefreshCw
} from "lucide-react";

/* ─────────────────────────────────────────
   FONT INJECTION
───────────────────────────────────────── */
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const NAV_SECTIONS = [
  { id: "contact",         label: "Contact Info",    icon: User         },
  { id: "summary",         label: "Summary",         icon: AlignLeft    },
  { id: "skills",          label: "Skills",          icon: Code         },
  { id: "experience",      label: "Experience",      icon: Briefcase    },
  { id: "education",       label: "Education",       icon: GraduationCap},
  { id: "projects",        label: "Projects",        icon: FileText     },
  { id: "certifications",  label: "Certifications",  icon: Award        },
];

const EMPTY_FORM = {
  contact: { fullName: "", phone: "", email: "", linkedin: "", location: "", website: "" },
  summary: "",
  skills: [
    { id: 1, category: "Programming Languages", items: "" },
    { id: 2, category: "Frameworks & Tools",     items: "" },
    { id: 3, category: "Cloud & Infrastructure", items: "" },
  ],
  experience: [{
    id: 1, company: "", title: "", location: "",
    startDate: "", endDate: "", current: false, responsibilities: "",
  }],
  education: [{
    id: 1, institution: "", degree: "", field: "",
    graduationDate: "", gpa: "", honors: "",
  }],
  projects: [{
    id: 1, name: "", technologies: "", description: "", link: "",
  }],
  certifications: [{
    id: 1, name: "", issuer: "", date: "",
  }],
};

const SAMPLE_FORM = {
  contact: {
    fullName: "Md. Tajul Islam",
    phone: "+1 (646) 555-0192",
    email: "tajul.islam@datacraft.io",
    linkedin: "linkedin.com/in/tajulislam-data",
    location: "New York, NY",
    website: "tajulislam.dev",
  },
  summary:
    "Data Analytics professional with 6+ years of experience designing and deploying enterprise-scale analytics solutions. Proven track record in building end-to-end data pipelines, interactive BI dashboards, and predictive ML models for Fortune 500 clients. Adept at translating complex business requirements into scalable technical architectures using Python, SQL, and cloud platforms. Strong communicator who bridges the gap between business stakeholders and engineering teams.",
  skills: [
    { id: 1, category: "Programming Languages", items: "Python, R, SQL, Scala, JavaScript, Bash" },
    { id: 2, category: "Data Visualization & BI", items: "Tableau, Power BI, Looker, D3.js, Matplotlib, Seaborn" },
    { id: 3, category: "Big Data & Cloud Platforms", items: "AWS (S3, Redshift, Glue, Lambda), Azure Data Factory, Snowflake, Databricks, Spark" },
    { id: 4, category: "Machine Learning & Analytics", items: "Scikit-learn, TensorFlow, Pandas, NumPy, dbt, Airflow" },
    { id: 5, category: "Databases", items: "PostgreSQL, MySQL, MongoDB, BigQuery, Redshift" },
  ],
  experience: [
    {
      id: 1,
      company: "DataBridge Analytics",
      title: "Senior Data Analytics Engineer",
      location: "New York, NY",
      startDate: "2021-03",
      endDate: "",
      current: true,
      responsibilities:
        "Led a team of 4 data engineers to build a real-time customer churn prediction model that reduced churn by 22%. Redesigned legacy ETL pipelines to reduce data processing time from 8 hours to 45 minutes. Built 12 executive Tableau dashboards that replaced manual monthly reports. Worked cross-functionally with Product, Marketing, and Finance teams to align KPIs. Managed AWS Redshift data warehouse migration handling 15TB of transaction data.",
    },
    {
      id: 2,
      company: "Nexus Capital Group",
      title: "Data Analyst",
      location: "Jersey City, NJ",
      startDate: "2018-07",
      endDate: "2021-02",
      current: false,
      responsibilities:
        "Developed automated Python scripts that saved 20+ analyst hours per week. Created risk scoring models using logistic regression that improved loan default detection by 34%. Collaborated with compliance team to build regulatory reporting dashboards for SEC submissions. Designed SQL stored procedures to standardize reporting across 5 business units. Mentored 2 junior analysts on Python and SQL best practices.",
    },
  ],
  education: [{
    id: 1,
    institution: "New York University – Tandon School of Engineering",
    degree: "Master of Science",
    field: "Data Science",
    graduationDate: "2018-05",
    gpa: "3.9/4.0",
    honors: "Graduate Research Fellow | Thesis: Predictive Modeling for Urban Traffic Pattern Analysis",
  }],
  projects: [
    {
      id: 1,
      name: "Real-Time E-Commerce Analytics Platform",
      technologies: "Python, Apache Kafka, Spark Streaming, PostgreSQL, Tableau",
      description:
        "Built a streaming analytics pipeline ingesting 500K+ daily transactions for a mid-sized e-commerce company. Created live dashboards tracking revenue, cart abandonment, and user funnels. Platform reduced time-to-insight from 24 hours to under 5 minutes and increased conversion tracking accuracy by 40%.",
      link: "github.com/tajulislam/ecommerce-analytics",
    },
    {
      id: 2,
      name: "NLP-Based Customer Sentiment Analyzer",
      technologies: "Python, BERT, FastAPI, React, AWS Lambda",
      description:
        "Deployed a fine-tuned BERT model to classify 10K+ daily customer support tickets into sentiment and urgency categories. Reduced manual triage time by 65% and improved first-response SLA compliance from 71% to 94%.",
      link: "github.com/tajulislam/sentiment-api",
    },
  ],
  certifications: [
    { id: 1, name: "AWS Certified Data Analytics – Specialty", issuer: "Amazon Web Services", date: "2022-09" },
    { id: 2, name: "Google Professional Data Engineer", issuer: "Google Cloud", date: "2023-03" },
    { id: 3, name: "Databricks Certified Associate Developer for Apache Spark", issuer: "Databricks", date: "2023-11" },
  ],
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function uid() { return Date.now() + Math.random(); }

function monthStr(val) {
  if (!val) return "";
  const [y, m] = val.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const idx = parseInt(m, 10) - 1;
  return names[idx] ? `${names[idx]} ${y}` : val;
}

/* ─────────────────────────────────────────
   FORM FIELD PRIMITIVES
───────────────────────────────────────── */
function Field({ label, required, hint, children, full }) {
  return (
    <div style={{ ...s.field, ...(full ? { gridColumn: "1/-1" } : {}) }}>
      <label style={s.label}>
        {label}
        {required && <span style={s.req}> *</span>}
        {hint && <span style={s.hint}> — {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        ...s.input,
        ...(focused ? s.inputFocus : {}),
        ...(disabled ? s.inputDisabled : {}),
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 5 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        ...s.input,
        ...s.ta,
        ...(focused ? s.inputFocus : {}),
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

/* ─────────────────────────────────────────
   SECTION: CONTACT
───────────────────────────────────────── */
function ContactSection({ data, onChange }) {
  const u = (k) => (v) => onChange({ ...data, [k]: v });
  return (
    <div style={s.grid2}>
      <Field label="Full Name" required full>
        <Input value={data.fullName} onChange={u("fullName")} placeholder="Md. Tajul Islam" />
      </Field>
      <Field label="Phone Number" required>
        <Input value={data.phone} onChange={u("phone")} placeholder="+1 (646) 555-0192" />
      </Field>
      <Field label="Email Address" required>
        <Input value={data.email} onChange={u("email")} placeholder="tajul@email.com" type="email" />
      </Field>
      <Field label="City, State" required>
        <Input value={data.location} onChange={u("location")} placeholder="New York, NY" />
      </Field>
      <Field label="LinkedIn URL">
        <Input value={data.linkedin} onChange={u("linkedin")} placeholder="linkedin.com/in/username" />
      </Field>
      <Field label="Portfolio / Website">
        <Input value={data.website} onChange={u("website")} placeholder="yourname.dev" />
      </Field>
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION: SUMMARY
───────────────────────────────────────── */
function SummarySection({ data, onChange }) {
  return (
    <div>
      <div style={s.infoBox}>
        <span style={s.infoIcon}>✦</span>
        The AI will transform your notes into a compelling 3–4 sentence ATS-optimized professional summary with industry keywords and quantified impact.
      </div>
      <Field label="Professional Background & Goals" hint="rough notes are fine">
        <Textarea
          value={data}
          onChange={onChange}
          placeholder="Describe your years of experience, core domains, key achievements, and career goals. E.g.: 'Data analytics professional with 6+ years in BI and ML. Led teams of 4. Built dashboards at Fortune 500 companies. Strong in Python, SQL, Tableau. Looking for senior IC or manager role in data-intensive org...'"
          rows={8}
        />
      </Field>
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION: SKILLS
───────────────────────────────────────── */
function SkillsSection({ data, onChange }) {
  const add = () => onChange([...data, { id: uid(), category: "", items: "" }]);
  const remove = (id) => onChange(data.filter(c => c.id !== id));
  const update = (id, k, v) => onChange(data.map(c => c.id === id ? { ...c, [k]: v } : c));
  return (
    <div>
      <div style={s.infoBox}>
        <span style={s.infoIcon}>✦</span>
        Group your skills by category. The AI will clean and enrich them. No proficiency bars — ATS rejects those.
      </div>
      {data.map((cat, i) => (
        <div key={cat.id} style={s.card}>
          <div style={s.cardHead}>
            <span style={s.cardLabel}>Category {i + 1}</span>
            {data.length > 1 && (
              <button style={s.delBtn} onClick={() => remove(cat.id)}><Trash2 size={13} /></button>
            )}
          </div>
          <div style={s.grid2}>
            <Field label="Category Name">
              <Input value={cat.category} onChange={v => update(cat.id, "category", v)} placeholder="e.g. Programming Languages" />
            </Field>
            <Field label="Skills (comma-separated)" full>
              <Input value={cat.items} onChange={v => update(cat.id, "items", v)} placeholder="Python, R, SQL, JavaScript, Scala" />
            </Field>
          </div>
        </div>
      ))}
      <button style={s.addBtn} onClick={add}><Plus size={13} /> Add Skill Category</button>
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION: EXPERIENCE
───────────────────────────────────────── */
function ExperienceSection({ data, onChange }) {
  const add = () => onChange([...data, { id: uid(), company: "", title: "", location: "", startDate: "", endDate: "", current: false, responsibilities: "" }]);
  const remove = (id) => onChange(data.filter(e => e.id !== id));
  const update = (id, k, v) => onChange(data.map(e => e.id === id ? { ...e, [k]: v } : e));
  return (
    <div>
      <div style={s.infoBox}>
        <span style={s.infoIcon}>✦</span>
        Describe your responsibilities in plain language. The AI will rewrite each into STAR-method bullets starting with strong action verbs and quantified results.
      </div>
      {data.map((exp, i) => (
        <div key={exp.id} style={s.card}>
          <div style={s.cardHead}>
            <span style={s.cardLabel}>Position {i + 1}</span>
            {data.length > 1 && <button style={s.delBtn} onClick={() => remove(exp.id)}><Trash2 size={13} /></button>}
          </div>
          <div style={s.grid2}>
            <Field label="Job Title" required>
              <Input value={exp.title} onChange={v => update(exp.id, "title", v)} placeholder="Senior Data Analytics Engineer" />
            </Field>
            <Field label="Company Name" required>
              <Input value={exp.company} onChange={v => update(exp.id, "company", v)} placeholder="DataBridge Analytics" />
            </Field>
            <Field label="Location">
              <Input value={exp.location} onChange={v => update(exp.id, "location", v)} placeholder="New York, NY" />
            </Field>
            <Field label="Start Date">
              <Input type="month" value={exp.startDate} onChange={v => update(exp.id, "startDate", v)} />
            </Field>
            <Field label="End Date">
              <Input type="month" value={exp.endDate} onChange={v => update(exp.id, "endDate", v)} disabled={exp.current} />
            </Field>
            <Field label="">
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 6 }}>
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={e => update(exp.id, "current", e.target.checked)}
                  style={{ accentColor: "#C9963A", width: 15, height: 15 }}
                />
                <span style={{ fontSize: 12, color: "#9199B4" }}>Currently working here</span>
              </label>
            </Field>
            <Field label="Responsibilities & Achievements" hint="AI will format with STAR method" full>
              <Textarea
                value={exp.responsibilities}
                onChange={v => update(exp.id, "responsibilities", v)}
                placeholder="Led a team of 4 to redesign ETL pipelines cutting processing time from 8hrs to 45min. Built 12 executive Tableau dashboards. Managed migration of 15TB Redshift warehouse. Reduced customer churn by 22% with ML prediction model..."
                rows={5}
              />
            </Field>
          </div>
        </div>
      ))}
      <button style={s.addBtn} onClick={add}><Plus size={13} /> Add Another Position</button>
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION: EDUCATION
───────────────────────────────────────── */
function EducationSection({ data, onChange }) {
  const add = () => onChange([...data, { id: uid(), institution: "", degree: "", field: "", graduationDate: "", gpa: "", honors: "" }]);
  const remove = (id) => onChange(data.filter(e => e.id !== id));
  const update = (id, k, v) => onChange(data.map(e => e.id === id ? { ...e, [k]: v } : e));
  return (
    <div>
      {data.map((edu, i) => (
        <div key={edu.id} style={s.card}>
          <div style={s.cardHead}>
            <span style={s.cardLabel}>Education {i + 1}</span>
            {data.length > 1 && <button style={s.delBtn} onClick={() => remove(edu.id)}><Trash2 size={13} /></button>}
          </div>
          <div style={s.grid2}>
            <Field label="Institution" required full>
              <Input value={edu.institution} onChange={v => update(edu.id, "institution", v)} placeholder="New York University – Tandon School of Engineering" />
            </Field>
            <Field label="Degree" required>
              <Input value={edu.degree} onChange={v => update(edu.id, "degree", v)} placeholder="Master of Science" />
            </Field>
            <Field label="Field of Study" required>
              <Input value={edu.field} onChange={v => update(edu.id, "field", v)} placeholder="Data Science" />
            </Field>
            <Field label="Graduation Date">
              <Input type="month" value={edu.graduationDate} onChange={v => update(edu.id, "graduationDate", v)} />
            </Field>
            <Field label="GPA" hint="optional">
              <Input value={edu.gpa} onChange={v => update(edu.id, "gpa", v)} placeholder="3.9/4.0" />
            </Field>
            <Field label="Honors & Distinctions" hint="optional" full>
              <Input value={edu.honors} onChange={v => update(edu.id, "honors", v)} placeholder="Magna Cum Laude | Dean's List | Thesis: ..." />
            </Field>
          </div>
        </div>
      ))}
      <button style={s.addBtn} onClick={add}><Plus size={13} /> Add Education</button>
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION: PROJECTS
───────────────────────────────────────── */
function ProjectsSection({ data, onChange }) {
  const add = () => onChange([...data, { id: uid(), name: "", technologies: "", description: "", link: "" }]);
  const remove = (id) => onChange(data.filter(e => e.id !== id));
  const update = (id, k, v) => onChange(data.map(e => e.id === id ? { ...e, [k]: v } : e));
  return (
    <div>
      <div style={s.infoBox}>
        <span style={s.infoIcon}>✦</span>
        The AI will convert your project description into 2–3 impact-focused bullet points with quantified results.
      </div>
      {data.map((proj, i) => (
        <div key={proj.id} style={s.card}>
          <div style={s.cardHead}>
            <span style={s.cardLabel}>Project {i + 1}</span>
            {data.length > 1 && <button style={s.delBtn} onClick={() => remove(proj.id)}><Trash2 size={13} /></button>}
          </div>
          <div style={s.grid2}>
            <Field label="Project Name" required>
              <Input value={proj.name} onChange={v => update(proj.id, "name", v)} placeholder="Real-Time E-Commerce Analytics Platform" />
            </Field>
            <Field label="Technologies Used">
              <Input value={proj.technologies} onChange={v => update(proj.id, "technologies", v)} placeholder="Python, Kafka, Spark, Tableau" />
            </Field>
            <Field label="Description & Impact" hint="include metrics if possible" full>
              <Textarea value={proj.description} onChange={v => update(proj.id, "description", v)} placeholder="Built a streaming pipeline handling 500K daily transactions. Created live dashboards. Reduced time-to-insight from 24hrs to 5min, increased conversion tracking accuracy by 40%..." rows={4} />
            </Field>
            <Field label="GitHub / Live Link" hint="optional">
              <Input value={proj.link} onChange={v => update(proj.id, "link", v)} placeholder="github.com/username/project" />
            </Field>
          </div>
        </div>
      ))}
      <button style={s.addBtn} onClick={add}><Plus size={13} /> Add Project</button>
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION: CERTIFICATIONS
───────────────────────────────────────── */
function CertificationsSection({ data, onChange }) {
  const add = () => onChange([...data, { id: uid(), name: "", issuer: "", date: "" }]);
  const remove = (id) => onChange(data.filter(e => e.id !== id));
  const update = (id, k, v) => onChange(data.map(e => e.id === id ? { ...e, [k]: v } : e));
  return (
    <div>
      {data.map((cert, i) => (
        <div key={cert.id} style={s.card}>
          <div style={s.cardHead}>
            <span style={s.cardLabel}>Certification {i + 1}</span>
            {data.length > 1 && <button style={s.delBtn} onClick={() => remove(cert.id)}><Trash2 size={13} /></button>}
          </div>
          <div style={s.grid2}>
            <Field label="Certification Name" required full>
              <Input value={cert.name} onChange={v => update(cert.id, "name", v)} placeholder="AWS Certified Data Analytics – Specialty" />
            </Field>
            <Field label="Issuing Organization">
              <Input value={cert.issuer} onChange={v => update(cert.id, "issuer", v)} placeholder="Amazon Web Services" />
            </Field>
            <Field label="Date Obtained">
              <Input type="month" value={cert.date} onChange={v => update(cert.id, "date", v)} />
            </Field>
          </div>
        </div>
      ))}
      <button style={s.addBtn} onClick={add}><Plus size={13} /> Add Certification</button>
    </div>
  );
}

/* ─────────────────────────────────────────
   RESUME PREVIEW (ATS-formatted)
───────────────────────────────────────── */
function ResumePreview({ resume }) {
  if (!resume) return null;
  const r = resume;
  const contactLine = [r.contact.phone, r.contact.email, r.contact.location, r.contact.linkedin, r.contact.website]
    .filter(Boolean).join("  |  ");

  return (
    <div id="ats-resume-doc" style={rs.doc}>
      {/* NAME */}
      <div style={rs.nameBlock}>
        <h1 style={rs.name}>{r.contact.fullName}</h1>
        <p style={rs.contactLine}>{contactLine}</p>
      </div>

      <div style={rs.rule} />

      {/* PROFESSIONAL SUMMARY */}
      {r.summary && (
        <section style={rs.section}>
          <h2 style={rs.sectionTitle}>PROFESSIONAL SUMMARY</h2>
          <div style={rs.ruleThin} />
          <p style={rs.bodyText}>{r.summary}</p>
        </section>
      )}

      {/* SKILLS */}
      {r.skills?.length > 0 && (
        <section style={rs.section}>
          <h2 style={rs.sectionTitle}>CORE COMPETENCIES & TECHNICAL SKILLS</h2>
          <div style={rs.ruleThin} />
          {r.skills.map((sg, i) => (
            <div key={i} style={rs.skillRow}>
              <span style={rs.skillCat}>{sg.category}: </span>
              <span style={rs.skillItems}>{Array.isArray(sg.items) ? sg.items.join(", ") : sg.items}</span>
            </div>
          ))}
        </section>
      )}

      {/* EXPERIENCE */}
      {r.experience?.length > 0 && (
        <section style={rs.section}>
          <h2 style={rs.sectionTitle}>PROFESSIONAL EXPERIENCE</h2>
          <div style={rs.ruleThin} />
          {r.experience.map((exp, i) => (
            <div key={i} style={rs.entry}>
              <div style={rs.entryHead}>
                <div>
                  <span style={rs.entryTitle}>{exp.title}</span>
                  <span style={rs.entrySub}> | {exp.company}{exp.location ? `, ${exp.location}` : ""}</span>
                </div>
                <span style={rs.entryDate}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
              </div>
              {exp.bullets?.length > 0 && (
                <ul style={rs.ul}>
                  {exp.bullets.map((b, bi) => <li key={bi} style={rs.li}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* EDUCATION */}
      {r.education?.length > 0 && (
        <section style={rs.section}>
          <h2 style={rs.sectionTitle}>EDUCATION</h2>
          <div style={rs.ruleThin} />
          {r.education.map((edu, i) => (
            <div key={i} style={rs.entry}>
              <div style={rs.entryHead}>
                <div>
                  <span style={rs.entryTitle}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                  <span style={rs.entrySub}> | {edu.institution}</span>
                </div>
                <span style={rs.entryDate}>{edu.graduationDate}</span>
              </div>
              {(edu.gpa || edu.honors) && (
                <p style={{ ...rs.bodyText, paddingLeft: 0, marginTop: 2 }}>
                  {[edu.gpa && `GPA: ${edu.gpa}`, edu.honors].filter(Boolean).join("  |  ")}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {r.projects?.length > 0 && (
        <section style={rs.section}>
          <h2 style={rs.sectionTitle}>NOTABLE PROJECTS</h2>
          <div style={rs.ruleThin} />
          {r.projects.map((proj, i) => (
            <div key={i} style={rs.entry}>
              <div style={rs.entryHead}>
                <span style={rs.entryTitle}>
                  {proj.name}{proj.technologies ? ` | ${proj.technologies}` : ""}
                </span>
                {proj.link && <span style={rs.entryDate}>{proj.link}</span>}
              </div>
              {proj.bullets?.length > 0 && (
                <ul style={rs.ul}>
                  {proj.bullets.map((b, bi) => <li key={bi} style={rs.li}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICATIONS */}
      {r.certifications?.length > 0 && (
        <section style={rs.section}>
          <h2 style={rs.sectionTitle}>PROFESSIONAL DEVELOPMENT & CERTIFICATIONS</h2>
          <div style={rs.ruleThin} />
          {r.certifications.map((cert, i) => (
            <div key={i} style={{ ...rs.entryHead, marginBottom: 5 }}>
              <span style={rs.entryTitle}>{cert.name}{cert.issuer ? ` | ${cert.issuer}` : ""}</span>
              <span style={rs.entryDate}>{cert.date}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   EXPORT HELPERS
───────────────────────────────────────── */
function buildPrintHTML(r) {
  const contactLine = [r.contact.phone, r.contact.email, r.contact.location, r.contact.linkedin, r.contact.website]
    .filter(Boolean).join("  |  ");

  let body = `
<h1>${r.contact.fullName}</h1>
<p class="contact">${contactLine}</p>
<div class="rule"></div>`;

  if (r.summary) {
    body += `<section><h2>PROFESSIONAL SUMMARY</h2><div class="rthin"></div><p>${r.summary}</p></section>`;
  }
  if (r.skills?.length) {
    body += `<section><h2>CORE COMPETENCIES &amp; TECHNICAL SKILLS</h2><div class="rthin"></div>`;
    r.skills.forEach(sg => {
      body += `<p class="skill-row"><strong>${sg.category}:</strong> ${Array.isArray(sg.items) ? sg.items.join(", ") : sg.items}</p>`;
    });
    body += `</section>`;
  }
  if (r.experience?.length) {
    body += `<section><h2>PROFESSIONAL EXPERIENCE</h2><div class="rthin"></div>`;
    r.experience.forEach(exp => {
      body += `<div class="entry">
        <div class="erow">
          <div><strong>${exp.title}</strong> | ${exp.company}${exp.location ? `, ${exp.location}` : ""}</div>
          <span class="date">${exp.startDate} &ndash; ${exp.current ? "Present" : exp.endDate}</span>
        </div>`;
      if (exp.bullets?.length) body += `<ul>${exp.bullets.map(b => `<li>${b}</li>`).join("")}</ul>`;
      body += `</div>`;
    });
    body += `</section>`;
  }
  if (r.education?.length) {
    body += `<section><h2>EDUCATION</h2><div class="rthin"></div>`;
    r.education.forEach(edu => {
      body += `<div class="entry"><div class="erow">
        <div><strong>${edu.degree}${edu.field ? ` in ${edu.field}` : ""}</strong> | ${edu.institution}</div>
        <span class="date">${edu.graduationDate}</span>
      </div>`;
      if (edu.gpa || edu.honors) body += `<p style="margin:2pt 0;font-size:10.5pt;">${[edu.gpa && `GPA: ${edu.gpa}`, edu.honors].filter(Boolean).join("  |  ")}</p>`;
      body += `</div>`;
    });
    body += `</section>`;
  }
  if (r.projects?.length) {
    body += `<section><h2>NOTABLE PROJECTS</h2><div class="rthin"></div>`;
    r.projects.forEach(proj => {
      body += `<div class="entry"><div class="erow">
        <strong>${proj.name}${proj.technologies ? ` | ${proj.technologies}` : ""}</strong>
        ${proj.link ? `<span class="date">${proj.link}</span>` : ""}
      </div>`;
      if (proj.bullets?.length) body += `<ul>${proj.bullets.map(b => `<li>${b}</li>`).join("")}</ul>`;
      body += `</div>`;
    });
    body += `</section>`;
  }
  if (r.certifications?.length) {
    body += `<section><h2>PROFESSIONAL DEVELOPMENT &amp; CERTIFICATIONS</h2><div class="rthin"></div>`;
    r.certifications.forEach(cert => {
      body += `<div class="erow" style="margin-bottom:5pt;">
        <strong>${cert.name}${cert.issuer ? ` | ${cert.issuer}` : ""}</strong>
        <span class="date">${cert.date}</span>
      </div>`;
    });
    body += `</section>`;
  }

  return `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<title>${r.contact.fullName} – Resume</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  @page { margin: 0.85in 1in; }
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #111; line-height: 1.42; }
  h1 { font-size: 20pt; font-weight: 700; text-align: center; margin-bottom: 5pt; }
  .contact { text-align: center; font-size: 10pt; color: #333; margin-bottom: 10pt; }
  .rule { border-top: 1.5pt solid #111; margin: 6pt 0 10pt; }
  .rthin { border-top: 0.75pt solid #aaa; margin: 2pt 0 8pt; }
  section { margin-bottom: 12pt; }
  h2 { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2pt; }
  .skill-row { font-size: 10.5pt; margin-bottom: 3pt; }
  .entry { margin-bottom: 9pt; }
  .erow { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2pt; font-size: 10.5pt; flex-wrap: wrap; gap: 4pt; }
  .date { font-size: 10pt; color: #444; white-space: nowrap; }
  ul { margin: 3pt 0 0 15pt; }
  li { font-size: 10.5pt; margin-bottom: 2.5pt; line-height: 1.36; }
  p { font-size: 10.5pt; margin-bottom: 4pt; }
</style>
</head><body>${body}</body></html>`;
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function ATSResumeGenerator() {
  // Font injection
  useEffect(() => {
    if (!document.getElementById("__ats-fonts")) {
      const link = document.createElement("link");
      link.id = "__ats-fonts";
      link.rel = "stylesheet";
      link.href = FONT_URL;
      document.head.appendChild(link);
    }
  }, []);

  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [genProgress, setGenProgress] = useState("");

  const updateSection = useCallback((key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  }, []);

  const loadSample = () => setFormData(SAMPLE_FORM);
  const clearForm  = () => { setFormData(EMPTY_FORM); setGeneratedResume(null); setSuccess(false); };

  /* ── AI GENERATION ── */
  const generateResume = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    const progressSteps = [
      "Analyzing your data…",
      "Applying STAR method to experience…",
      "Categorizing technical skills…",
      "Optimizing for ATS keywords…",
      "Formatting document structure…",
      "Finalizing your resume…",
    ];
    let step = 0;
    setGenProgress(progressSteps[0]);
    const progressInterval = setInterval(() => {
      step = (step + 1) % progressSteps.length;
      setGenProgress(progressSteps[step]);
    }, 1800);

    const prompt = `You are a world-class ATS resume strategist and professional writer. Your task is to transform the raw user data below into a perfectly polished, ATS-optimized resume.

=== USER DATA ===
${JSON.stringify(formData, null, 2)}

=== STRICT REQUIREMENTS ===

PROFESSIONAL SUMMARY:
- Write exactly 3-4 sentences
- Mention years of experience, key domain expertise, top 2-3 skills/tools, and a clear value proposition
- Use industry-specific keywords naturally embedded in the text
- Do NOT use first person (I, my, me)
- Be specific, not vague

SKILLS:
- Keep the user's categories but clean up the items
- Remove duplicates; add 1-2 highly relevant skills per category if they were implied by experience
- Return each category as an array of individual skill strings
- If a category is empty, skip it

EXPERIENCE BULLETS (most critical):
- Generate exactly 4-6 bullet points per role
- EVERY bullet MUST start with a past-tense action verb (Spearheaded, Architected, Engineered, Orchestrated, Streamlined, Optimized, Delivered, Reduced, Increased, Developed, Led, Designed, Automated, Deployed, etc.)
- Follow the STAR framework: [Action Verb] [Task/Context] [Method/Tool] [Quantified Result]
- Quantify every bullet if possible: percentages, dollar amounts, time saved, team size, scale of data, etc.
- If the user didn't provide numbers, infer reasonable estimates or use relative language ("significantly", "by over X%")
- Make bullets concise: 1-2 lines max
- NO weak verbs: "helped", "worked on", "was responsible for", "assisted"

EDUCATION:
- Format graduation date as "Mon YYYY" (e.g., "May 2018")
- Keep GPA only if 3.5 or above

PROJECTS:
- 2-3 bullets per project, impact-focused
- Include the technology stack and measurable outcomes

CERTIFICATIONS:
- Format date as "Mon YYYY"

DATE FORMAT: All dates must be formatted as "Mon YYYY" (e.g., "Mar 2021", "Present")

Return ONLY a valid JSON object — no markdown fences, no explanations, no preamble:
{
  "contact": {
    "fullName": "string",
    "phone": "string",
    "email": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string"
  },
  "summary": "string",
  "skills": [
    { "category": "string", "items": ["string"] }
  ],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "current": boolean,
      "bullets": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "field": "string",
      "institution": "string",
      "graduationDate": "string",
      "gpa": "string",
      "honors": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "technologies": "string",
      "link": "string",
      "bullets": ["string"]
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string"
    }
  ]
}`;

    try {
      // /api/generate → Vercel serverless function (API key নিরাপদ থাকে server-এ)
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      if (data.error) throw new Error(data.error.message);

      // serverless function returns { result: "...json string..." }
      const raw = typeof data.result === "string"
        ? data.result
        : (data.content || []).map(c => c.text || "").join("");
      const clean = raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
      const parsed = JSON.parse(clean);
      setGeneratedResume(parsed);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Generation failed: " + err.message + ". Please try again.");
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenProgress("");
    }
  };

  /* ── EXPORTS ── */
  const [exportMsg, setExportMsg] = useState(null);

  const showExportMsg = (msg, type = "info") => {
    setExportMsg({ msg, type });
    setTimeout(() => setExportMsg(null), 5000);
  };

  // DOCX: Blob → hidden <a> appended to body → programmatic click → revoke
  const exportDOCX = () => {
    if (!generatedResume) return;
    try {
      const html = buildPrintHTML(generatedResume);
      // Use application/vnd.ms-word so browsers treat it as a Word file
      const blob = new Blob([html], { type: "application/vnd.ms-word;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(generatedResume.contact.fullName || "Resume").replace(/\s+/g, "_")}_ATS_Resume.doc`;
      a.style.display = "none";
      // Must append to DOM first — required in Firefox & sandboxed iframes
      document.body.appendChild(a);
      a.click();
      // Clean up after a tick so the browser has time to initiate the download
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 200);
      showExportMsg("✓ DOCX download started — check your Downloads folder.", "success");
    } catch (err) {
      showExportMsg("⚠ Download blocked by sandbox. Run locally for full export support. See instructions below.", "warn");
    }
  };

  // PDF: inject a hidden <iframe>, write the resume HTML into it, call iframe.contentWindow.print()
  // This avoids window.open() entirely, which is blocked in sandboxed iframes.
  const exportPDF = () => {
    if (!generatedResume) return;
    try {
      const html = buildPrintHTML(generatedResume);

      // Remove any previous print iframe
      const existing = document.getElementById("__ats-print-frame");
      if (existing) existing.remove();

      const iframe = document.createElement("iframe");
      iframe.id = "__ats-print-frame";
      iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;opacity:0;pointer-events:none;";

      document.body.appendChild(iframe);

      // Write after appending so the iframe has a valid document
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        showExportMsg("⚠ PDF blocked by sandbox. Run locally for full export. See instructions below.", "warn");
        iframe.remove();
        return;
      }
      doc.open();
      doc.write(html);
      doc.close();

      // Wait for resources to load before printing
      const triggerPrint = () => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          showExportMsg("✓ Print dialog opened — choose 'Save as PDF' as your printer.", "success");
        } catch (e) {
          showExportMsg("⚠ PDF print blocked by sandbox. Run locally for full export. See instructions below.", "warn");
        }
        // Leave iframe for a moment so browser completes the print job, then remove
        setTimeout(() => iframe.remove(), 3000);
      };

      // Use onload if available, else small timeout fallback
      if (iframe.contentDocument?.readyState === "complete") {
        triggerPrint();
      } else {
        iframe.onload = triggerPrint;
        // Timeout fallback in case onload doesn't fire (some sandboxes)
        setTimeout(triggerPrint, 800);
      }
    } catch (err) {
      showExportMsg("⚠ PDF blocked by sandbox. Run locally for full export. See instructions below.", "warn");
    }
  };

  /* ── SECTION CONTENT MAP ── */
  const sectionMap = {
    contact:        <ContactSection        data={formData.contact}        onChange={v => updateSection("contact", v)} />,
    summary:        <SummarySection        data={formData.summary}        onChange={v => updateSection("summary", v)} />,
    skills:         <SkillsSection         data={formData.skills}         onChange={v => updateSection("skills", v)} />,
    experience:     <ExperienceSection     data={formData.experience}     onChange={v => updateSection("experience", v)} />,
    education:      <EducationSection      data={formData.education}      onChange={v => updateSection("education", v)} />,
    projects:       <ProjectsSection       data={formData.projects}       onChange={v => updateSection("projects", v)} />,
    certifications: <CertificationsSection data={formData.certifications} onChange={v => updateSection("certifications", v)} />,
  };

  const isLast = activeSection === NAV_SECTIONS.length - 1;

  return (
    <div style={s.app}>
      <style>{globalCSS}</style>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerL}>
          <span style={s.logoMark}>◆</span>
          <div>
            <div style={s.logoName}>ResumeForge <span style={s.logoAI}>AI</span></div>
            <div style={s.logoTagline}>ATS-Optimized Resume Generator</div>
          </div>
        </div>
        <div style={s.headerR}>
          <button style={s.sampleBtn} onClick={loadSample} title="Load sample data">
            <FileText size={13} /> Load Sample
          </button>
          <button style={s.clearBtn} onClick={clearForm} title="Clear all fields">
            <RefreshCw size={13} /> Clear
          </button>
          <span style={s.poweredBy}>Powered by Claude AI</span>
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={s.body}>

        {/* ── LEFT PANEL: FORM ── */}
        <div style={s.leftPanel}>

          {/* vertical stepper nav */}
          <nav style={s.stepper}>
            {NAV_SECTIONS.map((sec, idx) => {
              const Icon = sec.icon;
              const active = idx === activeSection;
              return (
                <button
                  key={sec.id}
                  style={{ ...s.stepBtn, ...(active ? s.stepBtnActive : {}) }}
                  onClick={() => setActiveSection(idx)}
                  title={sec.label}
                >
                  {active && <div style={s.stepBar} />}
                  <span style={{ ...s.stepIcon, ...(active ? s.stepIconActive : {}) }}>
                    <Icon size={14} />
                  </span>
                  <span style={{ ...s.stepLabel, ...(active ? s.stepLabelActive : {}) }}>
                    {sec.label}
                  </span>
                  <span style={{ ...s.stepNum, ...(active ? s.stepNumActive : {}) }}>
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* form content */}
          <div style={s.formWrap}>
            <div style={s.formHead}>
              <h2 style={s.formTitle}>{NAV_SECTIONS[activeSection].label}</h2>
              <span style={s.stepPill}>{activeSection + 1} / {NAV_SECTIONS.length}</span>
            </div>

            <div style={s.formScroll}>
              {sectionMap[NAV_SECTIONS[activeSection].id]}
            </div>

            {/* nav + generate */}
            <div style={s.formFoot}>
              <button
                style={{ ...s.navBtn, opacity: activeSection === 0 ? 0.35 : 1 }}
                onClick={() => setActiveSection(p => Math.max(0, p - 1))}
                disabled={activeSection === 0}
              >
                <ChevronLeft size={15} /> Prev
              </button>

              <button
                style={s.generateBtn}
                onClick={generateResume}
                disabled={isGenerating}
              >
                {isGenerating
                  ? <><Loader2 size={15} className="spin" /> Generating…</>
                  : <><Sparkles size={15} /> Generate ATS Resume</>}
              </button>

              <button
                style={{ ...s.navBtn, opacity: isLast ? 0.35 : 1 }}
                onClick={() => setActiveSection(p => Math.min(NAV_SECTIONS.length - 1, p + 1))}
                disabled={isLast}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>

            {/* status */}
            {isGenerating && (
              <div style={s.progressBox}>
                <Loader2 size={12} className="spin" />
                <span>{genProgress}</span>
              </div>
            )}
            {error && (
              <div style={s.errorBox}>
                <AlertCircle size={13} /> {error}
              </div>
            )}
            {success && !isGenerating && (
              <div style={s.successBox}>
                <CheckCircle2 size={13} /> Resume generated! Review it on the right and export below.
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL: PREVIEW ── */}
        <div style={s.rightPanel}>
          <div style={s.previewBar}>
            <span style={s.previewLabel}>
              {generatedResume ? "✓ ATS-Optimized Resume Preview" : "Resume Preview"}
            </span>
            {generatedResume && (
              <div style={s.exportRow}>
                <button style={s.exportDOCX} onClick={exportDOCX}>
                  <Download size={13} /> Export .DOCX
                </button>
                <button style={s.exportPDF} onClick={exportPDF}>
                  <Download size={13} /> Export .PDF
                </button>
              </div>
            )}
          </div>

          {/* Export status banner */}
          {exportMsg && (
            <div style={{
              ...s.exportBanner,
              ...(exportMsg.type === "success" ? s.exportBannerSuccess
                : exportMsg.type === "warn"    ? s.exportBannerWarn
                : s.exportBannerInfo),
            }}>
              {exportMsg.msg}
            </div>
          )}

          {/* Sandbox local-setup instructions (shown when a warn is active) */}
          {exportMsg?.type === "warn" && (
            <div style={s.localBox}>
              <p style={s.localTitle}>🖥 Run Locally for Full Export Support</p>
              <p style={s.localSub}>Copy the <code style={s.code}>.jsx</code> file, then follow these steps:</p>
              <div style={s.localSteps}>
                {[
                  { n:"1", cmd:"npm create vite@latest ats-resume -- --template react", label:"Scaffold Vite + React project" },
                  { n:"2", cmd:"cd ats-resume && npm install", label:"Install dependencies" },
                  { n:"3", cmd:"npm install lucide-react", label:"Install icon library" },
                  { n:"4", cmd:"cp ATSResumeGenerator.jsx src/App.jsx", label:"Replace src/App.jsx with the downloaded file" },
                  { n:"5", cmd:'# In src/main.jsx keep only:\n// import "./index.css"\nimport App from "./App"', label:"Remove default CSS import from main.jsx (optional)" },
                  { n:"6", cmd:"npm run dev", label:"Start dev server → open http://localhost:5173" },
                  { n:"7", cmd:"# Exports will work natively in your browser", label:"DOCX & PDF exports work in full browser context" },
                ].map(step => (
                  <div key={step.n} style={s.localStep}>
                    <span style={s.localN}>{step.n}</span>
                    <div style={s.localDetail}>
                      <span style={s.localLabel}>{step.label}</span>
                      <code style={s.localCmd}>{step.cmd}</code>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ ...s.localSub, marginTop: 8, color: "#6B7090" }}>
                ⚡ For production: add your Anthropic API key to a <code style={s.code}>.env</code> file as <code style={s.code}>VITE_ANTHROPIC_KEY</code> and replace the fetch header with <code style={s.code}>"x-api-key": import.meta.env.VITE_ANTHROPIC_KEY</code>
              </p>
            </div>
          )}

          <div style={s.previewScroll}>
            {generatedResume ? (
              <ResumePreview resume={generatedResume} />
            ) : (
              <div style={s.emptyState}>
                <div style={s.emptyGlyph}>◈</div>
                <p style={s.emptyTitle}>Your ATS Resume Will Appear Here</p>
                <p style={s.emptyDesc}>
                  Fill in your details across all sections, then click{" "}
                  <strong style={{ color: "#C9963A" }}>Generate ATS Resume</strong>.
                  <br />The AI will apply strict ATS formatting rules automatically.
                </p>
                <div style={s.atsList}>
                  {[
                    "Single-column ATS-safe layout",
                    "STAR-method experience bullets",
                    "Strong action verb openers",
                    "Quantified achievements",
                    "Categorized skills (no rating bars)",
                    "Contact info in body (not header/footer)",
                    "No tables, graphics, or text boxes",
                  ].map((rule, i) => (
                    <div key={i} style={s.atsRule}>
                      <span style={s.atsCheck}>✓</span> {rule}
                    </div>
                  ))}
                </div>
                <button style={s.sampleBtnBig} onClick={loadSample}>
                  <FileText size={14} /> Load Sample Data & Try It Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   APP STYLES (dark professional + gold)
───────────────────────────────────────── */
const C = {
  bg0: "#07080C",
  bg1: "#0C0E15",
  bg2: "#12141E",
  bg3: "#191C28",
  bg4: "#1F2330",
  gold: "#C9963A",
  goldBright: "#E0AD50",
  goldDim: "#9B7229",
  goldBg: "#1a1000",
  goldBorder: "rgba(201,150,58,0.3)",
  text0: "#EEE9E0",
  text1: "#B0B5C8",
  text2: "#6B7090",
  text3: "#3E4260",
  border: "#1C1F2E",
  borderMid: "#252A3D",
  red: "#E05252",
  redBg: "#1a0a0a",
  green: "#52C49A",
  greenBg: "#0a1a12",
};

const s = {
  app: {
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
    background: C.bg0,
    color: C.text0,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  /* header */
  header: {
    height: 52,
    background: C.bg1,
    borderBottom: `1px solid ${C.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    flexShrink: 0,
    zIndex: 10,
  },
  headerL: { display: "flex", alignItems: "center", gap: 10 },
  headerR: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { fontSize: 20, color: C.gold, lineHeight: 1 },
  logoName: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: C.text0,
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },
  logoAI: { color: C.gold },
  logoTagline: { fontSize: 10, color: C.text2, letterSpacing: "0.04em" },
  poweredBy: {
    fontSize: 10,
    color: C.text3,
    background: C.bg2,
    border: `1px solid ${C.border}`,
    borderRadius: 20,
    padding: "3px 10px",
    letterSpacing: "0.03em",
  },
  sampleBtn: {
    display: "flex", alignItems: "center", gap: 5,
    padding: "5px 12px",
    background: C.bg3,
    border: `1px solid ${C.borderMid}`,
    borderRadius: 6,
    color: C.text1,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  clearBtn: {
    display: "flex", alignItems: "center", gap: 5,
    padding: "5px 12px",
    background: "none",
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    color: C.text2,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  /* body layout */
  body: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
    height: "calc(100vh - 52px)",
  },
  /* left panel */
  leftPanel: {
    width: 460,
    minWidth: 380,
    display: "flex",
    flexShrink: 0,
    background: C.bg1,
    borderRight: `1px solid ${C.border}`,
    overflow: "hidden",
  },
  /* stepper */
  stepper: {
    width: 140,
    flexShrink: 0,
    background: C.bg2,
    borderRight: `1px solid ${C.border}`,
    display: "flex",
    flexDirection: "column",
    padding: "12px 0",
    gap: 2,
    overflowY: "auto",
  },
  stepBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    position: "relative",
    textAlign: "left",
    transition: "all 0.15s",
    borderRadius: 0,
  },
  stepBtnActive: { background: C.goldBg },
  stepBar: {
    position: "absolute",
    left: 0,
    top: "15%",
    height: "70%",
    width: 2,
    background: C.gold,
    borderRadius: "0 2px 2px 0",
  },
  stepIcon: {
    color: C.text3,
    flexShrink: 0,
    display: "flex",
    transition: "color 0.15s",
  },
  stepIconActive: { color: C.gold },
  stepLabel: {
    fontSize: 11,
    color: C.text3,
    flex: 1,
    letterSpacing: "0.01em",
    transition: "color 0.15s",
    lineHeight: 1.2,
  },
  stepLabelActive: { color: C.gold, fontWeight: 600 },
  stepNum: {
    fontSize: 10,
    color: C.text3,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  stepNumActive: { color: C.goldDim },
  /* form wrapper */
  formWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  formHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "13px 16px 10px",
    borderBottom: `1px solid ${C.border}`,
    flexShrink: 0,
  },
  formTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: C.text0,
    letterSpacing: "-0.01em",
  },
  stepPill: {
    fontSize: 10,
    color: C.text2,
    background: C.bg3,
    padding: "2px 8px",
    borderRadius: 10,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  formScroll: {
    flex: 1,
    overflowY: "auto",
    padding: "14px 16px",
  },
  formFoot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderTop: `1px solid ${C.border}`,
    flexShrink: 0,
    gap: 8,
    background: C.bg1,
  },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "7px 12px",
    background: C.bg3,
    border: `1px solid ${C.borderMid}`,
    borderRadius: 7,
    color: C.text1,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  generateBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 18px",
    background: `linear-gradient(135deg, ${C.goldDim}, ${C.gold}, ${C.goldBright})`,
    border: "none",
    borderRadius: 8,
    color: "#0C0A04",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: "0.01em",
    transition: "opacity 0.2s",
    flexShrink: 0,
  },
  progressBox: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "7px 14px",
    fontSize: 11,
    color: C.gold,
    background: C.goldBg,
    borderTop: `1px solid ${C.goldBorder}`,
    fontStyle: "italic",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 14px",
    fontSize: 11,
    color: C.red,
    background: C.redBg,
    borderTop: `1px solid #3d1010`,
  },
  successBox: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "7px 14px",
    fontSize: 11,
    color: C.green,
    background: C.greenBg,
    borderTop: `1px solid #103d22`,
  },
  /* right panel */
  rightPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: C.bg0,
    overflow: "hidden",
  },
  /* export banner */
  exportBanner: {
    padding: "7px 18px",
    fontSize: 11.5,
    flexShrink: 0,
    letterSpacing: "0.01em",
  },
  exportBannerSuccess: { background: C.greenBg, color: C.green, borderBottom: `1px solid #103d22` },
  exportBannerWarn:    { background: "#1a1100", color: "#D4A030", borderBottom: `1px solid #3d2800` },
  exportBannerInfo:    { background: C.bg2,     color: C.text2,   borderBottom: `1px solid ${C.border}` },
  /* local setup box */
  localBox: {
    background: "#0a0c14",
    borderBottom: `1px solid #1C1F2E`,
    padding: "12px 18px",
    flexShrink: 0,
    overflowY: "auto",
    maxHeight: 300,
  },
  localTitle: { fontSize: 12, fontWeight: 700, color: "#C9963A", fontFamily: "'Syne', sans-serif", marginBottom: 4 },
  localSub:   { fontSize: 11, color: "#6B7090", marginBottom: 8, lineHeight: 1.5 },
  localSteps: { display: "flex", flexDirection: "column", gap: 5 },
  localStep:  { display: "flex", gap: 10, alignItems: "flex-start" },
  localN:     { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#C9963A", background: "#1a1000", border: "1px solid #3d2800", borderRadius: 4, padding: "1px 6px", flexShrink: 0, marginTop: 2 },
  localDetail:{ display: "flex", flexDirection: "column", gap: 2 },
  localLabel: { fontSize: 11, color: "#9199B4" },
  localCmd:   { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#52C49A", background: "#081410", padding: "2px 8px", borderRadius: 4, display: "block", whiteSpace: "pre", overflowX: "auto" },
  code:       { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#52C49A", background: "#081410", padding: "1px 5px", borderRadius: 3 },
  previewBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    borderBottom: `1px solid ${C.border}`,
    background: C.bg1,
    flexShrink: 0,
  },
  previewLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 11,
    color: C.text2,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: 600,
  },
  exportRow: { display: "flex", gap: 8 },
  exportDOCX: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 14px",
    background: C.bg3,
    border: `1px solid ${C.borderMid}`,
    borderRadius: 7,
    color: C.text0,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 500,
    transition: "all 0.15s",
  },
  exportPDF: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 14px",
    background: `linear-gradient(135deg, ${C.goldDim}, ${C.gold})`,
    border: "none",
    borderRadius: 7,
    color: "#0C0A04",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 700,
  },
  previewScroll: {
    flex: 1,
    overflowY: "auto",
    padding: "28px",
    display: "flex",
    justifyContent: "center",
  },
  /* empty state */
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 380,
    margin: "auto",
    textAlign: "center",
    gap: 14,
  },
  emptyGlyph: {
    fontSize: 48,
    color: C.text3,
    fontFamily: "monospace",
    lineHeight: 1,
  },
  emptyTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: C.text1,
    letterSpacing: "-0.02em",
  },
  emptyDesc: {
    fontSize: 13,
    color: C.text2,
    lineHeight: 1.65,
  },
  atsList: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    alignItems: "flex-start",
    background: C.bg2,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "14px 18px",
    width: "100%",
  },
  atsRule: { fontSize: 12, color: C.text2, display: "flex", alignItems: "center", gap: 8 },
  atsCheck: { color: C.green, fontSize: 13, fontWeight: 700 },
  sampleBtnBig: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 20px",
    background: C.goldBg,
    border: `1px solid ${C.goldBorder}`,
    borderRadius: 8,
    color: C.gold,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 600,
    marginTop: 4,
  },
  /* form primitives */
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px 14px",
  },
  field: { display: "flex", flexDirection: "column", gap: 4 },
  label: {
    fontSize: 10,
    fontWeight: 600,
    color: C.text2,
    textTransform: "uppercase",
    letterSpacing: "0.09em",
  },
  req: { color: C.gold },
  hint: { color: C.text3, fontWeight: 400, textTransform: "none", letterSpacing: 0 },
  input: {
    background: C.bg2,
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    padding: "7px 11px",
    color: C.text0,
    fontSize: 12.5,
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  },
  inputFocus: { borderColor: C.goldDim },
  inputDisabled: { opacity: 0.4, cursor: "not-allowed" },
  ta: { resize: "vertical", minHeight: 80, lineHeight: 1.5 },
  infoBox: {
    display: "flex",
    gap: 8,
    background: C.goldBg,
    border: `1px solid ${C.goldBorder}`,
    borderRadius: 6,
    padding: "8px 11px",
    fontSize: 11.5,
    color: "#9B7229",
    lineHeight: 1.55,
    marginBottom: 12,
  },
  infoIcon: { color: C.gold, fontSize: 13, flexShrink: 0, marginTop: 1 },
  card: {
    background: C.bg2,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: 13,
    marginBottom: 10,
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    fontWeight: 600,
    color: C.gold,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  delBtn: {
    background: "none",
    border: `1px solid #3d1010`,
    borderRadius: 5,
    color: "#7a3333",
    cursor: "pointer",
    padding: "3px 6px",
    display: "flex",
    alignItems: "center",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
    padding: "8px",
    background: "none",
    border: `1px dashed ${C.borderMid}`,
    borderRadius: 7,
    color: C.text2,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
};

/* ─────────────────────────────────────────
   RESUME DOC STYLES (white paper look)
───────────────────────────────────────── */
const rs = {
  doc: {
    background: "#ffffff",
    color: "#111111",
    fontFamily: "Calibri, 'Trebuchet MS', Arial, sans-serif",
    fontSize: "11pt",
    lineHeight: 1.42,
    padding: "0.85in 1in",
    width: "100%",
    maxWidth: 820,
    minHeight: "11in",
    boxShadow: "0 4px 60px rgba(0,0,0,0.7)",
  },
  nameBlock: { textAlign: "center", marginBottom: "10pt" },
  name: {
    fontSize: "21pt",
    fontWeight: 700,
    color: "#111",
    margin: 0,
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
  },
  contactLine: {
    fontSize: "10pt",
    color: "#333",
    margin: "4pt 0 0 0",
    lineHeight: 1.5,
  },
  rule: { borderTop: "1.5pt solid #111", margin: "8pt 0 10pt" },
  ruleThin: { borderTop: "0.75pt solid #bbb", margin: "2pt 0 8pt" },
  section: { marginBottom: "12pt" },
  sectionTitle: {
    fontSize: "9.5pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1.5pt",
    color: "#111",
    margin: 0,
  },
  bodyText: {
    fontSize: "10.5pt",
    color: "#111",
    margin: 0,
    lineHeight: 1.5,
  },
  skillRow: {
    fontSize: "10.5pt",
    color: "#111",
    marginBottom: "3pt",
    lineHeight: 1.4,
  },
  skillCat: { fontWeight: 700 },
  skillItems: { color: "#111" },
  entry: { marginBottom: "9pt" },
  entryHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "2pt",
    flexWrap: "wrap",
    gap: "4pt",
  },
  entryTitle: {
    fontSize: "10.5pt",
    fontWeight: 700,
    color: "#111",
  },
  entrySub: {
    fontSize: "10.5pt",
    color: "#111",
  },
  entryDate: {
    fontSize: "10pt",
    color: "#444",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  ul: { margin: "3pt 0 0 15pt", padding: 0 },
  li: {
    fontSize: "10.5pt",
    color: "#111",
    marginBottom: "2.5pt",
    lineHeight: 1.36,
    listStyleType: "disc",
  },
};

/* ─────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────── */
const globalCSS = `
  * { box-sizing: border-box; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 0.8s linear infinite; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: #0C0E15; }
  ::-webkit-scrollbar-thumb { background: #252A3D; border-radius: 2px; }
  button:hover { opacity: 0.88; }
  input[type="month"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
`;
