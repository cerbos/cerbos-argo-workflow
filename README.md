# Cerbos with Argo Workflow

## Prerequisite

- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [Argo CLI](https://github.com/argoproj/argo-workflows/releases/latest)
- [Helm](https://helm.sh/docs/intro/install/)


## Setup

```sh
minikube start
```

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
Make sure to edit the `demo-app/cerbos-values.yaml` file to point to your fork/repo.

```sh
helm repo add cerbos https://download.cerbos.dev/helm-charts
helm repo update
helm install cerbos cerbos/cerbos --version=0.23.1 --values=demo-app/cerbos-values.yaml
```

### Deploy Demo App
TODO


## Update Policies

- Update the policies & tests in `/cerbos`
- Commit and push the changes
- Trigger the Argo job (you can automate this via webhooks later)
  ```
  argo submit -n argo --watch https://raw.githubusercontent.com/cerbos/cerbos-argo-workflow/main/ci.yaml -p branch=main -p repoPath=/cerbos -p repo=https://github.com/cerbos/cerbos-argo-workflow.git
  ```
- Port forward into the cluster to see the job in the Argo UI
  ```
  kubectl -n argo port-forward deployment/argo-server 2746:2746
  ```
- If all the changes are valid and the test pass, the last step of the job will tell the Cerbos instance to reload the policies from the repo.