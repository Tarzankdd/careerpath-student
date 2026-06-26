import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  MapPin,
  Search,
  Sparkles,
  Star,
  Target,
  UserRound
} from "lucide-react";
import { courses, industries, internships, jobs, locations, roadmap, tips } from "./data.js";

const tabs = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard },
  { id: "internships", label: "Internships", icon: GraduationCap },
  { id: "jobs", label: "Jobs", icon: BriefcaseBusiness },
  { id: "plan", label: "Career Plan", icon: Target },
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "saved", label: "Saved", icon: Star }
];

const statuses = ["Saved", "Applied", "Interview", "Accepted", "Rejected"];

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [saved, setSaved] = useState([
    { ...internships[0], category: "internship", status: "Saved" },
    { ...jobs[1], category: "job", status: "Interview" }
  ]);
  const [toast, setToast] = useState("");
  const [checkedSteps, setCheckedSteps] = useState(["Update CV", "Pick 2 career paths"]);

  const saveOpportunity = (item, category) => {
    setSaved((current) => {
      if (current.some((savedItem) => savedItem.id === item.id)) return current;
      return [...current, { ...item, category, status: "Saved" }];
    });
    showToast(`${item.title} saved to your opportunities`);
  };

  const applyOpportunity = (item) => {
    setSaved((current) => {
      const exists = current.some((savedItem) => savedItem.id === item.id);
      if (exists) {
        return current.map((savedItem) =>
          savedItem.id === item.id ? { ...savedItem, status: "Applied" } : savedItem
        );
      }
      const category = item.salary ? "job" : "internship";
      return [...current, { ...item, category, status: "Applied" }];
    });
    showToast(`Application started for ${item.title}`);
  };

  const updateStatus = (id, status) => {
    setSaved((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const toggleStep = (step) => {
    setCheckedSteps((current) =>
      current.includes(step) ? current.filter((item) => item !== step) : [...current, step]
    );
  };

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.careerPathToast);
    window.careerPathToast = window.setTimeout(() => setToast(""), 2600);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:px-8">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} savedCount={saved.length} />
        <main className="min-w-0 flex-1">
          {toast && (
            <div className="fixed right-4 top-4 z-50 rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-soft">
              {toast}
            </div>
          )}
          {activeTab === "home" && (
            <Dashboard
              setActiveTab={setActiveTab}
              saveOpportunity={saveOpportunity}
              applyOpportunity={applyOpportunity}
              saved={saved}
              checkedCount={checkedSteps.length}
            />
          )}
          {activeTab === "internships" && (
            <OpportunityPage
              title="Internship Explorer"
              eyebrow="Focused internship search"
              description="Find practical student placements and compare fit before applying."
              items={internships}
              category="internship"
              saved={saved}
              saveOpportunity={saveOpportunity}
              applyOpportunity={applyOpportunity}
              showLevel={false}
            />
          )}
          {activeTab === "jobs" && (
            <OpportunityPage
              title="Job Finder"
              eyebrow="Entry-level and junior roles"
              description="Explore full-time and part-time jobs with salary, company, and match details."
              items={jobs}
              category="job"
              saved={saved}
              saveOpportunity={saveOpportunity}
              applyOpportunity={applyOpportunity}
              showLevel
            />
          )}
          {activeTab === "plan" && (
            <CareerPlan checkedSteps={checkedSteps} toggleStep={toggleStep} />
          )}
          {activeTab === "profile" && <Profile />}
          {activeTab === "saved" && <Saved saved={saved} updateStatus={updateStatus} />}
        </main>
      </div>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, savedCount }) {
  return (
    <aside className="lg:sticky lg:top-5 lg:h-[calc(100vh-40px)] lg:w-72">
      <div className="card flex h-full flex-col gap-5 p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-950">CareerPath Student</h1>
            <p className="text-xs font-medium text-slate-500">Plan, apply, grow</p>
          </div>
        </div>
        <nav className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {tab.label}
                </span>
                {tab.id === "saved" && (
                  <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-white/20" : "bg-slate-200"}`}>
                    {savedCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white">
          <p className="text-sm font-bold">Design Thinking Problem</p>
          <p className="mt-2 text-xs leading-5 text-slate-300">
            Students need a simple platform to explore internships, find entry-level jobs, and plan their career path.
          </p>
        </div>
      </div>
    </aside>
  );
}

function Dashboard({ setActiveTab, saveOpportunity, applyOpportunity, saved, checkedCount }) {
  const progress = Math.round((checkedCount / 9) * 100);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-soft">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold text-blue-200">Welcome back, Dara</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
              Build a career plan that turns confusion into clear next steps.
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[
                ["Find Internship", "internships", GraduationCap],
                ["Find Job", "jobs", BriefcaseBusiness],
                ["Build Career Plan", "plan", Target],
                ["Resume Tips", "profile", FileText]
              ].map(([label, tab, Icon]) => (
                <button
                  key={label}
                  onClick={() => setActiveTab(tab)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15"
                >
                  <Icon size={17} />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-5 text-slate-950">
            <p className="text-sm font-bold text-slate-500">Current career goal</p>
            <h3 className="mt-2 text-2xl font-extrabold">Junior Product Designer</h3>
            <div className="mt-5 space-y-3">
              <Progress label="Portfolio readiness" value={72} />
              <Progress label="Application progress" value={progress} />
              <Progress label="Interview confidence" value={64} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="grid min-w-0 gap-6 2xl:grid-cols-2">
          <DashboardPanel title="Recommended Internships">
            {internships.slice(0, 2).map((item) => (
              <DashboardOpportunityCard
                key={item.id}
                item={item}
                category="internship"
                saved={saved.some((savedItem) => savedItem.id === item.id)}
                onSave={() => saveOpportunity(item, "internship")}
                onApply={() => applyOpportunity(item)}
                compact
              />
            ))}
          </DashboardPanel>
          <DashboardPanel title="Recommended Jobs">
            {jobs.slice(0, 2).map((item) => (
              <DashboardOpportunityCard
                key={item.id}
                item={item}
                category="job"
                saved={saved.some((savedItem) => savedItem.id === item.id)}
                onSave={() => saveOpportunity(item, "job")}
                onApply={() => applyOpportunity(item)}
                compact
              />
            ))}
          </DashboardPanel>
        </section>
        <aside className="space-y-6">
          <AICard />
          <DashboardPanel title="Progress Tracker">
            <div className="space-y-4">
              <Progress label="Career roadmap" value={progress} />
              <Progress label="Saved opportunities" value={Math.min(saved.length * 18, 100)} />
              <Progress label="Resume strength" value={76} />
            </div>
          </DashboardPanel>
        </aside>
      </div>
    </div>
  );
}

function DashboardPanel({ title, children }) {
  return (
    <div className="card min-w-0 p-5">
      <h3 className="text-xl font-extrabold text-slate-950">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function DashboardOpportunityCard({ item, category, saved, onSave, onApply }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
              {item.match}% match
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {item.type}
            </span>
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
              {item.industry}
            </span>
          </div>
          <h4 className="mt-3 text-lg font-extrabold leading-snug text-slate-950">{item.title}</h4>
          <div className="mt-3 grid gap-2 text-sm font-medium text-slate-500 sm:grid-cols-2">
            <span className="flex min-w-0 items-center gap-2">
              <Building2 size={15} className="shrink-0" />
              <span className="truncate">{item.company}</span>
            </span>
            <span className="flex min-w-0 items-center gap-2">
              <MapPin size={15} className="shrink-0" />
              <span className="truncate">{item.location}</span>
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">
            {category === "job" ? item.salary : item.duration}
          </p>
        </div>
        <div className="flex gap-2 sm:flex-col">
          <button
            className="secondary-button min-w-[112px] flex-1 whitespace-nowrap sm:flex-none"
            onClick={onSave}
          >
            <Star size={16} className={saved ? "fill-purple-500 text-purple-500" : ""} />
            {saved ? "Saved" : "Save"}
          </button>
          <button className="primary-button min-w-[112px] flex-1 whitespace-nowrap sm:flex-none" onClick={onApply}>
            Apply
          </button>
        </div>
      </div>
    </article>
  );
}

function OpportunityPage({
  title,
  eyebrow,
  description,
  items,
  category,
  saved,
  saveOpportunity,
  applyOpportunity,
  showLevel
}) {
  const [type, setType] = useState("All");
  const [industry, setIndustry] = useState("All");
  const [location, setLocation] = useState("All locations");
  const [level, setLevel] = useState("All");
  const [selectedId, setSelectedId] = useState(items[0].id);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const typeMatch = type === "All" || item.type === type;
      const industryMatch = industry === "All" || item.industry === industry;
      const locationMatch = location === "All locations" || item.location === location;
      const levelMatch = !showLevel || level === "All" || item.level === level;
      return typeMatch && industryMatch && locationMatch && levelMatch;
    });
  }, [items, type, industry, location, level, showLevel]);

  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || items[0];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="card p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FilterSelect label="Work type" value={type} onChange={setType} options={["All", "Full-time", "Part-time"]} />
          {showLevel && (
            <FilterSelect label="Level" value={level} onChange={setLevel} options={["All", "Entry-level", "Junior"]} />
          )}
          <FilterSelect label="Industry" value={industry} onChange={setIndustry} options={["All", ...industries]} />
          <FilterSelect label="Location" value={location} onChange={setLocation} options={locations} />
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">{filtered.length} opportunities match your filters</p>
            <span className="pill">
              <Search className="mr-1 inline" size={14} />
              Live prototype filter
            </span>
          </div>
          {filtered.map((item) => (
            <OpportunityCard
              key={item.id}
              item={item}
              category={category}
              active={selected.id === item.id}
              saved={saved.some((savedItem) => savedItem.id === item.id)}
              onSelect={() => setSelectedId(item.id)}
              onSave={() => saveOpportunity(item, category)}
              onApply={() => applyOpportunity(item)}
            />
          ))}
          {!filtered.length && (
            <div className="card p-8 text-center">
              <p className="text-lg font-bold text-slate-900">No exact matches yet</p>
              <p className="mt-2 text-sm text-slate-500">Try a different industry, work type, or location.</p>
            </div>
          )}
        </div>
        <DetailCard item={selected} category={category} onSave={() => saveOpportunity(selected, category)} onApply={() => applyOpportunity(selected)} />
      </div>
    </div>
  );
}

function OpportunityCard({ item, category, saved, active, onSelect, onSave, onApply, compact }) {
  return (
    <article
      onClick={onSelect}
      className={`card cursor-pointer p-4 transition hover:-translate-y-0.5 hover:border-blue-200 ${
        active ? "border-blue-300 ring-4 ring-blue-100" : ""
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill bg-blue-50 text-blue-700">{item.match}% Career Match</span>
            <span className="pill">{item.type}</span>
            {item.level && <span className="pill">{item.level}</span>}
          </div>
          <h3 className="mt-3 text-lg font-extrabold text-slate-950">{item.title}</h3>
          <div className="mt-2 flex flex-wrap gap-3 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><Building2 size={15} />{item.company}</span>
            <span className="flex items-center gap-1.5"><MapPin size={15} />{item.location}</span>
            {item.salary && <span>{item.salary}</span>}
          </div>
          {!compact && <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            className="secondary-button flex-1 whitespace-nowrap md:flex-none"
            onClick={(event) => {
              event.stopPropagation();
              onSave();
            }}
          >
            <Star size={16} className={saved ? "fill-purple-500 text-purple-500" : ""} />
            {saved ? "Saved" : "Save"}
          </button>
          <button
            className="primary-button flex-1 whitespace-nowrap md:flex-none"
            onClick={(event) => {
              event.stopPropagation();
              onApply();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </article>
  );
}

function DetailCard({ item, category, onSave, onApply }) {
  return (
    <aside className="card sticky top-5 h-fit p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">{category} detail</p>
          <h3 className="mt-2 text-2xl font-extrabold text-slate-950">{item.title}</h3>
        </div>
        <div className="rounded-2xl bg-purple-50 px-3 py-2 text-center">
          <p className="text-2xl font-extrabold text-purple-700">{item.match}%</p>
          <p className="text-xs font-bold text-purple-500">match</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{item.description}</p>
      <div className="mt-5 grid gap-3 text-sm">
        <InfoRow label="Company" value={item.company} />
        <InfoRow label="Industry" value={item.industry} />
        <InfoRow label="Location" value={item.location} />
        <InfoRow label="Work type" value={item.type} />
        {item.duration && <InfoRow label="Duration" value={item.duration} />}
        {item.salary && <InfoRow label="Salary range" value={item.salary} />}
      </div>
      <div className="mt-5">
        <p className="text-sm font-bold text-slate-900">Skills you will use</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {item.skills.map((skill) => (
            <span key={skill} className="pill bg-slate-50">{skill}</span>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="secondary-button" onClick={onSave}><Star size={16} />Save</button>
        <button className="primary-button" onClick={onApply}>Apply</button>
      </div>
    </aside>
  );
}

function CareerPlan({ checkedSteps, toggleStep }) {
  const [goal, setGoal] = useState("Junior Product Designer");
  const allSteps = roadmap.flatMap((phase) => phase.steps);
  const progress = Math.round((checkedSteps.length / allSteps.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career planning workspace"
        title="Build a roadmap for your future"
        description="Choose a goal, review skills, follow a timeline, and track each preparation step."
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="card p-5">
            <label className="text-sm font-bold text-slate-700">Choose career goal</label>
            <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold" value={goal} onChange={(e) => setGoal(e.target.value)}>
              {["Junior Product Designer", "Frontend Developer", "Business Analyst", "Marketing Coordinator", "Finance Associate"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <div className="mt-5 rounded-2xl bg-blue-50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-blue-800"><Lightbulb size={16} />AI Career Suggestion</p>
              <p className="mt-2 text-sm leading-6 text-blue-900">
                Your saved roles show strong interest in design and technology. Focus on portfolio projects, user research, and basic frontend skills.
              </p>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="text-lg font-extrabold">Skills needed</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Communication", "Problem solving", "Figma", "Data analysis", "Presentation", "Teamwork"].map((skill) => (
                <span className="pill bg-white" key={skill}>{skill}</span>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="text-lg font-extrabold">Recommended courses</h3>
            <div className="mt-3 space-y-3">
              {courses.map((course) => (
                <div key={course} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                  <GraduationCap className="text-blue-600" size={18} />
                  <span className="text-sm font-semibold text-slate-700">{course}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Progress checklist</h3>
              <span className="pill bg-purple-50 text-purple-700">{progress}% complete</span>
            </div>
            <div className="mt-4 space-y-3">
              {allSteps.map((step) => {
                const checked = checkedSteps.includes(step);
                return (
                  <button
                    key={step}
                    onClick={() => toggleStep(step)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left text-sm font-semibold transition ${
                      checked ? "border-blue-200 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
                    }`}
                  >
                    <CheckCircle2 size={19} className={checked ? "fill-blue-600 text-white" : "text-slate-300"} />
                    {step}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="text-lg font-extrabold">Step-by-step roadmap</h3>
            <div className="mt-5 space-y-5">
              {roadmap.map((phase) => (
                <div key={phase.time} className="grid gap-3 rounded-2xl border border-slate-200 p-4 sm:grid-cols-[120px_1fr]">
                  <div>
                    <span className="pill bg-blue-50 text-blue-700">{phase.time}</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-950">{phase.title}</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-600">
                      {phase.steps.map((step) => <li key={step}>{step}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile and resume"
        title="Make your student story application-ready"
        description="Show education, skills, experience, portfolio links, and resume improvement tips in one place."
      />
      <div className="grid gap-6 xl:grid-cols-[370px_1fr]">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-2xl font-extrabold text-blue-700">DS</div>
            <div>
              <h3 className="text-2xl font-extrabold">Dara Sok</h3>
              <p className="text-sm font-medium text-slate-500">Year 3 Business IT Student</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <InfoRow label="Education" value="BSc Business Information Technology" />
            <InfoRow label="University" value="National University Student" />
            <InfoRow label="Career goal" value="Junior Product Designer" />
          </div>
          <button className="primary-button mt-6 w-full"><FileText size={16} />Upload resume</button>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ProfileSection title="Skills" items={["Figma", "React basics", "Research", "Presentation", "Excel", "Team leadership"]} />
          <ProfileSection title="Experience" items={["Campus design club coordinator", "Volunteer event planner", "Class project: student job board"]} />
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-lg font-extrabold">Portfolio link</h3>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium" value="https://dara-portfolio.example" readOnly />
              <button className="secondary-button">Update link</button>
            </div>
          </div>
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-lg font-extrabold">Resume improvement tips</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {tips.map((tip) => (
                <div key={tip} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                  <CheckCircle2 className="text-blue-600" size={18} />
                  <span className="text-sm font-semibold text-slate-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Saved({ saved, updateStatus }) {
  const savedInternships = saved.filter((item) => item.category === "internship");
  const savedJobs = saved.filter((item) => item.category === "job");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Application tracker"
        title="Saved opportunities"
        description="Keep internships and jobs organized as they move from saved to interview, accepted, or rejected."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <SavedColumn title="Saved Internships" items={savedInternships} updateStatus={updateStatus} />
        <SavedColumn title="Saved Jobs" items={savedJobs} updateStatus={updateStatus} />
      </div>
    </div>
  );
}

function SavedColumn({ title, items, updateStatus }) {
  return (
    <div className="card p-5">
      <h3 className="text-lg font-extrabold">{title}</h3>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-slate-950">{item.title}</h4>
                <p className="mt-1 text-sm font-medium text-slate-500">{item.company}</p>
              </div>
              <span className="pill bg-blue-50 text-blue-700">{item.match}%</span>
            </div>
            <select
              className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
              value={item.status}
              onChange={(event) => updateStatus(item.id, event.target.value)}
            >
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>
        ))}
        {!items.length && <p className="rounded-2xl bg-slate-50 p-5 text-sm font-medium text-slate-500">No saved items yet.</p>}
      </div>
    </div>
  );
}

function ProfileSection({ title, items }) {
  return (
    <div className="card p-5">
      <h3 className="text-lg font-extrabold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => <span className="pill" key={item}>{item}</span>)}
      </div>
    </div>
  );
}

function AICard() {
  return (
    <div className="card overflow-hidden p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
          <Sparkles size={21} />
        </div>
        <div>
          <h3 className="font-extrabold">AI Career Suggestion</h3>
          <p className="text-xs font-semibold text-slate-500">Based on saved roles and skills</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Apply for one IT internship and one design assistant role this week. Pair it with a small portfolio project to raise your match score.
      </p>
      <div className="mt-4 flex items-center gap-2 text-sm font-bold text-blue-700">
        View suggested roadmap <ChevronRight size={16} />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function PageHeader({ eyebrow, title, description }) {
  return (
    <header className="card p-6">
      <p className="text-sm font-bold uppercase tracking-wide text-blue-600">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
    </header>
  );
}

function Progress({ label, value }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-200">
        <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-3 py-2">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

export default App;
