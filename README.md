# Cloud Native Games

A purple, white and charcoal retro athletics demo for Nutanix Kubernetes Platform. First release: a browser-based 100m sprint, original canvas artwork, keyboard/touch controls, false starts and personal bests stored in the browser.

## Run locally

Requires Node.js 22 or newer. No npm install is needed.

```sh
npm start
```

Open http://localhost:8080. Select Start race, wait three seconds for GO, then alternate A/L or the left/right arrow keys. Touch players use the two step buttons. Held keys and repeated presses of the same side do not accelerate the athlete. Hiding the browser tab resets an active race. Scores remain on that browser only.

```sh
npm run check
npm test
docker build -t cloud-native-games:local .
docker run --rm -p 8080:8080 cloud-native-games:local
```

## Delivery flow

Application commit → GitHub Actions tests → multi-architecture image in GHCR → exact image digest committed into `deploy/overlays/demo/kustomization.yaml` → NKP GitOps reconciles that directory → Kubernetes rolling update.

CI never calls the cluster API. Manifest-only commits are reconciled without an image build. The digest update does not start another build. Application version and build commit are available at `/version.json` and displayed in the footer. `DEMO_BANNER` is a pod environment variable that can be changed declaratively in the Deployment.

## Before publishing and deploying

1. Create/select a GitHub repository with default branch `main` and push the project contents at its root.
2. Enable GitHub Actions. The workflow needs permission to publish packages and push to `main`. It uses `GITHUB_TOKEN`; no personal token is needed for the workflow. If branch rules prohibit bot pushes, replace the direct manifest commit with a deployment pull request workflow before use.
3. Run the publish workflow once. It replaces the bootstrap image with the repository's lowercase GHCR image and digest. **Do not enable reconciliation while the placeholder bootstrap image remains.**
4. Make the GHCR package public for an easy public demo, or configure an image-pull secret separately in the application namespace and reference it in the Deployment. A public Git repository does not guarantee its package is public.
5. Confirm NKP version, target workspace/project, namespace policies and GitOps permissions. The overlay currently creates the namespace `cloud-native-games`; for a pre-provisioned NKP project namespace, change the overlay namespace and remove `namespace.yaml` from its resources.
6. Point NKP's existing GitOps connection at the same repository, branch `main`, path `./deploy/overlays/demo`. Do not install another Flux instance. If explicit Flux resources are needed, adapt `gitops/flux.yaml.example` to installed CRDs and project RBAC, and apply through the existing platform bootstrap process. Those example resources are not part of the app reconciliation directory.
7. For private Git, create a read-only Git authentication secret in the GitOps source namespace. Registry authentication is separate. Never commit credentials or kubeconfig.
8. First validate via `kubectl kustomize deploy/overlays/demo` and a server-side dry run against the intended cluster. Once deployed, use `kubectl -n cloud-native-games port-forward svc/cloud-native-games 8080:80` for initial access.
9. For a browser URL, adapt `ingress.yaml.example`, rename it to `ingress.yaml`, and add it to overlay resources. Confirm ingress class, hostname, DNS, controller exposure and a TLS secret in the app namespace. No ingress provider is assumed.

Cluster egress must reach GitHub and GHCR. For an isolated cluster, mirror the image and Git source into reachable services and adapt the workflow and manifests.

## Files

- `app/`: static game and simulation module.
- `server.mjs`: dependency-free HTTP server with allowlisted assets, health and version endpoints.
- `Dockerfile`: non-root Node container; no build step or runtime packages.
- `deploy/`: Kubernetes base and demo overlay, resource limits and health probes.
- `gitops/`: version-dependent Flux connection example.
- `.github/workflows/publish.yaml`: CI and digest updates.
- `docs/demo-runbook.md`: presentation steps and environment checklist.

## Verification status

JavaScript syntax and five automated simulation/HTTP checks pass in the creation environment. Docker, kubectl and a browser are not assumed available; image builds, Kubernetes API validation and a real browser play-through must be completed before the live presentation. This is a scaffold for NKP deployment, not a claim that a cluster is already connected.

## Next releases

Hurdles and long jump; optional shared leaderboard API and database; optional real workload metrics. The UI's platform chips describe the intended architecture, not live cluster telemetry. The artwork and game logic are original. The Nutanix wordmark is rendered as plain text; add approved logo assets if required by your organisation.

Technical references:
- https://fluxcd.io/flux/components/kustomize/kustomizations/
- https://fluxcd.io/flux/components/source/gitrepositories/
- https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images
