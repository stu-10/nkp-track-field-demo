# Presenter runbook

## Environment details to fill in

| Setting | Value |
|---|---|
| NKP version | Pending |
| GitHub owner/repository | Pending |
| Repository visibility | Pending |
| Container registry / visibility | GHCR proposed; pending |
| NKP workspace/project | Pending |
| Target namespace | cloud-native-games proposed |
| Ingress class / hostname / TLS | Pending |
| Git and registry egress | Pending |
| GitOps source namespace / RBAC | Pending |

## Rehearsal

1. Verify Git source and Kustomization are Ready in NKP/Flux. Check two available replicas and the displayed commit. Play the sprint and explain that game execution occurs in the browser while Kubernetes serves the application.
2. Update a visible app string in `app/index.html`, commit and merge. Watch the Actions build, digest commit, GitOps reconciliation and pod rollout. Refresh the browser and verify the footer commit and changed text. Existing open sessions keep their loaded code until refreshed.
3. Change `DEMO_BANNER` in `deploy/base/deployment.yaml` and merge. No image build is needed; the pod template change triggers a rollout. Refresh to show the new banner.
4. Demonstrate rollback by reverting only the deployment digest commit to a previously available digest. Source rollback and deployment rollback are different: reverting app source starts a new build; reverting the digest restores the earlier image. Ensure the image is retained in the registry.
5. Temporarily scale the demo Deployment to three replicas with kubectl, while Git specifies two. Watch the GitOps reconciliation restore two. Only demonstrate this in the isolated demo namespace.
6. Delete one demo pod. Show the Deployment replacing it. Explain that this recovery is Kubernetes control-loop behaviour, separate from GitOps. Two replicas do not guarantee uninterrupted service if they share a failed node; node distribution is a later hardening step.

## Acceptance before presenting

- Keyboard and touch race complete; early input causes a false start; replay works.
- Image builds for the target architecture and runs under the configured security context.
- Manifests validate with the installed Kubernetes and Flux CRDs.
- Image pulls succeed, probes are healthy, and DNS/TLS work.
- A merged app change reaches the browser; digest rollback succeeds.
- GitOps drift correction and Kubernetes pod replacement are demonstrated.
