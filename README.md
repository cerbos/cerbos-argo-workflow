# Cerbos with Argo Workflow

## Prerequisite

- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- k8s cluster (recommend [Minikube](https://minikube.sigs.k8s.io/docs/start/))
- [Argo CLI](https://github.com/argoproj/argo-workflows/releases/latest)
- [Helm](https://helm.sh/docs/intro/install/)


## Setup

If you are using `minikube` run `minikube start`

### Install Argo
See https://argoproj.github.io/argo-workflows/quick-start/

```sh
kubectl create namespace argo
kubectl apply -n argo -f https://github.com/argoproj/argo-workflows/releases/download/v3.4.4/install.yaml
kubectl patch deployment \
  argo-server \
  --namespace argo \
  --type='json' \
  -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/args", "value": [
  "server",
  "--auth-mode=server"
]}]'
```

### Deploy Cerbos
Make sure to edit the `cerbos-values.yaml` file to point to your fork/repo. This sets up the Cerbos instance to pull the policies down from the repo on startup (you will have to configure an access token for private repos) but disables polling so that the CI workflow controls this (bit of a stretch, but only for demo purposes).

```sh
helm repo add cerbos https://download.cerbos.dev/helm-charts
helm repo update
helm install cerbos cerbos/cerbos --version=0.23.1 --values=cerbos-values.yaml
```

### Deploy Demo App

```sh
kubectl apply -f demo-app/k8s.yaml
```

Port forward into the cluster to see the demo app UI on [http://localhost:3000](http://localhost:3000)
```sh
kubectl port-forward deployment/demo-app 3000:3000
```


## Update Policies

- Update the policies & tests in `/cerbos`
- Commit and push the changes
- Trigger the Argo job pointing at your respository (you can automate this via webhooks later)
  ```
  argo submit -n argo --watch https://raw.githubusercontent.com/cerbos/cerbos-argo-workflow/main/ci.yaml -p branch=main -p repoPath=/cerbos -p repo=https://github.com/cerbos/cerbos-argo-workflow.git
  ```
- Port forward into the cluster to see the job in the Argo UI on [http://localhost:2746](http://localhost:2746)
  ```
  kubectl -n argo port-forward deployment/argo-server 2746:2746
  ```
- If all the changes are valid and the test pass, the last step of the job will tell the Cerbos instance to reload the policies from the repo.
- The demo application will now respond based on the new policies.