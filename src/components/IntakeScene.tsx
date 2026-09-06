import { useEffect, useState } from "react";
// Adapted from the application's reviewed fictional electrical fixture.
export const INTAKE_SOURCE = "Hi, I’m Casey Morgan. Can someone replace two ceiling fans and examine the outdoor outlet at my house? Friday would be ideal. Call me at +1 (202) 555-0104. I can put the new fans by the front door.";
export const ILLUSTRATED_ADDRESS = "24 Example Lane, Exampleton, NY 10001";
export function intakeFollowUp(address: string) {
  return "Hi Casey, thanks for reaching out about the two ceiling fans and outdoor outlet. " + (!address.trim() ? "Could you confirm the full service address? " : "") + "Which calendar date did you mean by Friday? We’ll review the request once these details are confirmed.";
}
export function intakeExport(address: string) {
  return { sourceMode: "fictional-scripted-walkthrough", reviewStatus: "Draft — human review required", contactName: "Casey Morgan", phone: "+1 (202) 555-0104", preferredContact: "Phone call", serviceAddress: address.trim() || null, serviceAddressStatus: address.trim() ? "Entered by user in fictional walkthrough" : "Missing", requestedWork: "Replace two ceiling fans; examine the outdoor outlet.", requestedTiming: "Friday would be ideal.", requestedDate: null, accessNotes: "New fans can be placed by the front door." };
}
export default function IntakeScene({ step, onInteract }: { step: number; onInteract?: () => void }) {
  const [address, setAddress] = useState(ILLUSTRATED_ADDRESS);
  const [downloaded, setDownloaded] = useState(false);
  useEffect(() => { if (step === 0) { setAddress(ILLUSTRATED_ADDRESS); setDownloaded(false); } }, [step]);
  const corrected = step >= 3;
  const currentAddress = corrected ? address.trim() : "";
  const checks = 3 + (currentAddress ? 1 : 0);
  function download() {
    onInteract?.();
    const url=URL.createObjectURL(new Blob([JSON.stringify(intakeExport(address), null, 2)], { type: "application/json" }));
    const link=document.createElement("a");link.href=url;link.download="fictional-job-intake-walkthrough.json";link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);setDownloaded(true);
  }
  return <section className="intake-walkthrough" aria-label="Fictional Job Intake Cleaner workspace">
    <div className="intake-scene-top"><strong>Job Intake Cleaner</strong><span>Fictional • scripted</span></div>
    <div className="intake-scene-grid">
      <aside className="intake-source"><span className="eyebrow">CUSTOMER MESSAGE</span><h3>One request. A few gaps.</h3><p>{INTAKE_SOURCE}</p><span className="intake-note">Website message · suggested trade: Electrical</span><details><summary>Inspect source evidence</summary><blockquote>“Call me at +1 (202) 555-0104.”</blockquote><blockquote>“Friday would be ideal.”</blockquote><p>Quotes support source matching, not factual verification.</p></details></aside>
      <div className="intake-card">
        {step === 0 ? <><span className="eyebrow">RECEIVED</span><h3>Start with what the customer actually said.</h3><div className="intake-message-cues"><span>2 ceiling fans</span><span>Outdoor outlet</span><span>“Friday”</span></div><p>The next scene uses a prepared extraction of this exact fictional message.</p><p className="intake-attention">No provider call occurs in this portfolio.</p></> : <>
          <div className="intake-card-heading"><span className="eyebrow">{step === 4 ? "FOLLOW-UP DRAFT" : step === 5 ? "CURRENT JOB CARD" : "ORGANIZED REQUEST"}</span><span className="intake-draft">Draft · review required</span></div>
          <h3>{step === 4 ? "A focused next conversation." : "Casey Morgan · electrical request"}</h3>
          {step === 4 ? <><p className="intake-note">Preferred contact: phone call · talking points, not a sent message</p><div className="intake-follow-up">{intakeFollowUp(address)}</div><p>No availability, price, booking, or emergency response is promised.</p></> : <dl className="intake-fields"><div><dt>Phone <small>Extracted</small></dt><dd>+1 (202) 555-0104</dd></div><div><dt>Requested work <small>Extracted</small></dt><dd>Replace two ceiling fans; examine the outdoor outlet.</dd></div><div className={currentAddress ? "intake-corrected" : "intake-missing"}><dt>Service address <small>{currentAddress ? "Entered by user" : "Missing"}</small></dt><dd>{step === 3 ? <><label htmlFor="walkthrough-address">Try the fictional correction</label><input id="walkthrough-address" value={address} onFocus={onInteract} onChange={(event)=>{setAddress(event.target.value);setDownloaded(false);onInteract?.();}} maxLength={160}/></> : currentAddress || "Ask the customer for the full address"}</dd></div><div className="intake-missing"><dt>Requested timing <small>Needs review</small></dt><dd>“Friday would be ideal.”<span className="intake-note">Exact date unresolved. Confirm which Friday.</span></dd></div></dl>}
          {step !== 4 && <p className="intake-checks">{checks} of 4 required checks satisfied <span>{currentAddress ? "Timing and human review still outstanding." : "Contact, phone, and scope supplied. Address needed."}</span></p>}
          {step === 5 && <><button className="intake-download" onClick={download}>Download fictional JSON ↓</button><p role="status">{downloaded ? "Fictional JSON prepared with the current edited address." : "This download uses your current walkthrough edit and retains draft status."}</p><span className="intake-note">The product also implements copy, CSV, and printer-friendly output.</span></>}
        </>}
      </div>
    </div>
    <p className="intake-scene-footer">Scripted playback only. The product’s live extraction requires your OpenAI API key.</p>
  </section>;
}
