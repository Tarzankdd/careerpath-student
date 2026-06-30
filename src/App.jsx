import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  MapPin,
  Bookmark,
  Search,
  Sparkles,
  Star,
  Target,
  UserRound,
  X
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
  const [detailOpportunity, setDetailOpportunity] = useState(null);

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
              onViewDetails={(item) => setDetailOpportunity(item)}
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
              onViewDetails={(item) => setDetailOpportunity({ ...item, category: "internship" })}
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
              onViewDetails={(item) => setDetailOpportunity({ ...item, category: "job" })}
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
      {detailOpportunity && (
        <OpportunityDetailsModal
          item={detailOpportunity}
          saved={saved.some((savedItem) => savedItem.id === detailOpportunity.id)}
          onClose={() => setDetailOpportunity(null)}
          onSave={() => saveOpportunity(detailOpportunity, detailOpportunity.category)}
          onApply={() => applyOpportunity(detailOpportunity)}
        />
      )}
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

function Dashboard({ setActiveTab, saveOpportunity, applyOpportunity, saved, checkedCount, onViewDetails }) {
  const progress = Math.round((checkedCount / 9) * 100);
  const recommended = [
    ...internships.slice(0, 2).map((item) => ({ ...item, category: "internship" })),
    ...jobs.slice(0, 2).map((item) => ({ ...item, category: "job" }))
  ];

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
        <RecommendationBoard
          items={recommended}
          saved={saved}
          onSave={saveOpportunity}
          onApply={applyOpportunity}
          onViewDetails={onViewDetails}
          setActiveTab={setActiveTab}
        />
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

function RecommendationBoard({ items, saved, onSave, onApply, onViewDetails, setActiveTab }) {
  return (
    <section className="card min-w-0 overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Top matches today</p>
          <h3 className="mt-1 text-2xl font-extrabold text-slate-950">Recommended Opportunities</h3>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Internships and jobs ranked by your profile, skills, and current career goal.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="secondary-button whitespace-nowrap" onClick={() => setActiveTab("internships")}>
            Internships
          </button>
          <button className="primary-button whitespace-nowrap" onClick={() => setActiveTab("jobs")}>
            Jobs
          </button>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <DashboardOpportunityRow
            key={item.id}
            item={item}
            saved={saved.some((savedItem) => savedItem.id === item.id)}
            onSave={() => onSave(item, item.category)}
            onApply={() => onApply(item)}
            onViewDetails={() => onViewDetails(item)}
          />
        ))}
      </div>
    </section>
  );
}

function DashboardOpportunityRow({ item, saved, onSave, onApply, onViewDetails }) {
  const isJob = item.category === "job";
  const logoLetters = item.company
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="bg-white p-5 transition hover:bg-slate-50">
      <div className="grid gap-5 md:grid-cols-[64px_minmax(0,1fr)_180px] md:items-start">
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-extrabold shadow-sm ${isJob ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
          {logoLetters}
        </div>

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap gap-2">
            <OpportunityBadge tone={isJob ? "blue" : "purple"} label={isJob ? "Job" : "Internship"} />
            <OpportunityBadge tone="slate" label={item.type} />
            {item.location === "Remote" && <OpportunityBadge tone="green" label="Remote" />}
          </div>

          <div>
            <h4 className="text-xl font-extrabold leading-tight text-slate-950">{item.title}</h4>
            <p className="mt-1 text-sm font-semibold text-slate-600">{item.company}</p>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-slate-500">
            <MetaItem icon={MapPin} label={item.location} />
            <MetaItem icon={Clock3} label={item.duration || item.type} />
            {item.salary && <MetaItem icon={DollarSign} label={item.salary} />}
          </div>

          <div className="flex flex-wrap gap-2">
            {item.skills.slice(0, 4).map((skill) => (
              <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <MatchBadge score={item.match} />
            <span className="text-xs font-bold text-slate-400">{item.posted || "Posted recently"}</span>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] md:grid-cols-1">
          <button
            className="secondary-button min-w-0 whitespace-nowrap"
            onClick={onSave}
          >
            <Star size={16} className={saved ? "fill-purple-500 text-purple-500" : ""} />
            {saved ? "Saved" : "Save"}
          </button>
          <button className="primary-button min-w-0 whitespace-nowrap" onClick={onApply}>
            Apply Now
          </button>
          <button className="secondary-button min-w-0 whitespace-nowrap" onClick={onViewDetails}>
            View Details
          </button>
          <button className="icon-button justify-self-end sm:justify-self-auto md:justify-self-end" onClick={onSave} aria-label="Bookmark">
            <Bookmark size={18} className={saved ? "fill-purple-500 text-purple-500" : ""} />
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
  onViewDetails,
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
              onViewDetails={() => onViewDetails(item)}
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

function OpportunityCard({ item, category, saved, active, onSelect, onSave, onApply, onViewDetails }) {
  const isInternship = category === "internship";
  const logoLetters = item.company
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      onClick={() => {
        onSelect();
        onViewDetails();
      }}
      className={`cursor-pointer rounded-[20px] border bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg ${
        active ? "border-blue-300 ring-4 ring-blue-100" : "border-slate-200"
      }`}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(210px,25%)_minmax(280px,45%)_minmax(190px,30%)] xl:items-stretch">
        <section className="flex min-w-0 gap-4">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold shadow-sm ${
            isInternship ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"
          }`}>
            {logoLetters}
          </div>
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-2">
              <OpportunityBadge tone={isInternship ? "purple" : "blue"} label={isInternship ? "Internship" : "Job"} />
              <OpportunityBadge tone="blue" label={item.type} />
              {item.location === "Remote" && <OpportunityBadge tone="green" label="Remote" />}
              {item.level && <OpportunityBadge tone="slate" label={item.level} />}
            </div>
            <h3 className="text-[22px] font-extrabold leading-tight text-slate-950">{item.title}</h3>
            <p className="mt-2 text-base font-semibold text-slate-700">{item.company}</p>
          </div>
        </section>

        <section className="min-w-0 space-y-4 rounded-2xl bg-slate-50/70 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <MatchBadge score={item.match} />
            <span className="text-sm font-semibold text-slate-500">{item.posted || "Posted recently"}</span>
          </div>
          <div className="grid gap-3 text-sm font-medium text-slate-600 sm:grid-cols-2">
            <MetaItem icon={MapPin} label={item.location} />
            <MetaItem icon={Clock3} label={item.duration || item.type} />
            {item.salary && <MetaItem icon={DollarSign} label={item.salary} />}
            {!item.salary && <MetaItem icon={CalendarCheck} label={item.industry} />}
          </div>
          <div className="flex flex-wrap gap-2">
            {item.skills.slice(0, 5).map((skill) => (
              <span key={skill} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="flex flex-col justify-between gap-4 xl:items-end">
          <button
            className="icon-button self-end"
            aria-label={saved ? "Saved opportunity" : "Save opportunity"}
            onClick={(event) => {
              event.stopPropagation();
              onSave();
            }}
          >
            <Bookmark size={18} className={saved ? "fill-purple-500 text-purple-500" : ""} />
          </button>
          <div className="grid gap-3 sm:grid-cols-3 xl:w-full xl:grid-cols-1">
            <button
              className="secondary-button w-full whitespace-nowrap"
              onClick={(event) => {
                event.stopPropagation();
                onSave();
              }}
            >
              <Star size={16} className={saved ? "fill-purple-500 text-purple-500" : ""} />
              {saved ? "Saved" : "Save"}
            </button>
            <button
              className="primary-button w-full whitespace-nowrap"
              onClick={(event) => {
                event.stopPropagation();
                onApply();
              }}
            >
              Apply Now
            </button>
            <button
              className="secondary-button w-full whitespace-nowrap"
              onClick={(event) => {
                event.stopPropagation();
                onSelect?.();
                onViewDetails();
              }}
            >
              View Details
            </button>
          </div>
        </section>
      </div>
    </article>
  );
}

function OpportunityDetailsModal({ item, saved, onClose, onSave, onApply }) {
  const isInternship = item.category === "internship";

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="max-h-[94vh] w-full overflow-y-auto rounded-t-[24px] bg-white shadow-2xl sm:max-w-3xl sm:rounded-[24px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="opportunity-detail-title"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-5 backdrop-blur sm:px-7">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-2">
              <OpportunityBadge tone={isInternship ? "purple" : "blue"} label={isInternship ? "Internship" : "Job"} />
              <OpportunityBadge tone="slate" label={item.type} />
              {item.location === "Remote" && <OpportunityBadge tone="green" label="Remote" />}
            </div>
            <h2 id="opportunity-detail-title" className="text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
              {item.title}
            </h2>
            <p className="mt-2 text-base font-semibold text-slate-600">{item.company}</p>
          </div>
          <button className="icon-button shrink-0" onClick={onClose} aria-label="Close details">
            <X size={20} />
          </button>
        </header>

        <div className="grid gap-7 px-5 py-6 sm:px-7 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0 space-y-7">
            <section>
              <h3 className="text-lg font-extrabold text-slate-950">About this opportunity</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </section>

            <DetailList title="What you will do" items={item.responsibilities} />
            <DetailList title="What we are looking for" items={item.requirements} />

            <section>
              <h3 className="text-lg font-extrabold text-slate-950">Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <MatchBadge score={item.match} />
            <div className="mt-5 space-y-4 text-sm font-semibold text-slate-600">
              <MetaItem icon={MapPin} label={item.location} />
              <MetaItem icon={Clock3} label={item.duration || item.type} />
              {item.salary && <MetaItem icon={DollarSign} label={item.salary} />}
              <MetaItem icon={Building2} label={item.industry} />
              <MetaItem icon={CalendarCheck} label={item.posted} />
            </div>
          </aside>
        </div>

        <footer className="sticky bottom-0 grid gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:grid-cols-[1fr_1.4fr] sm:px-7">
          <button className="secondary-button w-full" onClick={onSave}>
            <Star size={17} className={saved ? "fill-purple-500 text-purple-500" : ""} />
            {saved ? "Saved" : "Save Opportunity"}
          </button>
          <button className="primary-button w-full" onClick={onApply}>Apply Now</button>
        </footer>
      </section>
    </div>
  );
}

function DetailList({ title, items = [] }) {
  return (
    <section>
      <h3 className="text-lg font-extrabold text-slate-950">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-blue-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function OpportunityBadge({ tone, label }) {
  const tones = {
    purple: "bg-purple-50 text-purple-700 ring-purple-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200"
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${tones[tone]}`}>
      {label}
    </span>
  );
}

function MatchBadge({ score }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 shadow-sm">
      <span className="text-sm tracking-wide text-amber-400">★★★★<span className="text-slate-300">☆</span></span>
      <span className="text-sm font-extrabold text-blue-700">{score}% Match</span>
    </div>
  );
}

function MetaItem({ icon: Icon, label }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Icon size={16} className="shrink-0 text-slate-400" />
      <span className="truncate">{label}</span>
    </span>
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
