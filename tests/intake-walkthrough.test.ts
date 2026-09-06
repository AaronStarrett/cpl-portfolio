import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { primaryAction, productAction, projectSchema } from "../src/data/schema";
import { projects } from "../src/data/projects";
import { stories } from "../src/data/stories";
import { intakeFollowUp, intakeExport } from "../src/components/IntakeScene";
const project = projects.find(p=>p.slug==="job-intake-cleaner")!;
test("intake has separate local walkthrough and exact product root actions",()=>{
  assert.equal(primaryAction(project).label,"Watch walkthrough");
  assert.equal(primaryAction(project).href,"/projects/job-intake-cleaner/#walkthrough");
  assert.equal(primaryAction(project).external,false);
  assert.deepEqual(productAction(project),{href:"https://cpl-job-intake-cleaner.astarrett.workers.dev",label:"Open Job Intake Cleaner",external:true});
  assert.notEqual(productAction(project)?.href,project.repositoryUrl);
  assert.equal(new URL(productAction(project)!.href).search,"");
});
test("dual action support leaves existing external projects unchanged",()=>{
  const report=projects.find(p=>p.slug==="job-report-builder")!;
  assert.equal(report.presentation,"external-live-app");
  assert.equal(productAction(report),null);
  assert.equal(primaryAction(report).href,report.deployedUrl);
  const noProduct=projectSchema.parse({...project,deployedUrl:undefined});assert.equal(productAction(noProduct),null);
});
test("intake story covers six concrete stages with honest scripted label",()=>{
  const story=stories[project.story!];assert.equal(story.renderer,"job-intake-cleaner");assert.equal(story.scenes.length,6);
  assert.match(story.label,/Fictional.*scripted.*no live AI/);
  assert.match(story.scenes[2].caption,/Friday/);assert.match(story.scenes[3].caption,/24 Example Lane/);assert.match(story.scenes[5].caption,/current corrected address/);
  assert.match(project.maturity,/bring your own OpenAI key/);
  assert.match(project.evidence!,/has not been independently verified/);
});
test("walkthrough has no provider transport and retains explicit review, evidence and current edit flow",()=>{
  const source=readFileSync(new URL("../src/components/IntakeScene.tsx",import.meta.url),"utf8");
  assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|WebSocket|api\/analyze|api\.openai/);
  assert.match(source,/intakeFollowUp\(address\)/);assert.match(source,/intakeExport\(address\)/);assert.match(source,/requestedDate: null/);assert.match(source,/sourceMode: "fictional-scripted-walkthrough"/);
});

test("fictional operator edits reach follow-up and export without inventing dates",()=>{
  const edited="42 Fiction Lane, Exampleton, NY 10001";
  assert.equal(intakeExport(edited).serviceAddress,edited);assert.equal(intakeExport(edited).requestedDate,null);
  assert.equal(intakeExport(" ").serviceAddress,null);assert.match(intakeFollowUp(""),/full service address/);
  assert.doesNotMatch(intakeFollowUp(edited),/full service address/);assert.match(intakeFollowUp(edited),/calendar date/);
  assert.doesNotMatch(intakeFollowUp(edited),/email address/);
});
