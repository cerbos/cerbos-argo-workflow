# Cerbos with Argo Workflow

## Prerequisite

- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [Argo CLI](https://github.com/argoproj/argo-workflows/releases/latest)
- [Helm](https://helm.sh/docs/intro/install/)


## Setup Argo in Cluster
See https://argoproj.github.io/argo-workflows/quick-start/

```sh
minikube start
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

## Deploy our sample app
```s
helm repo add cerbos https://download.cerbos.dev/helm-charts
helm repo update
helm install cerbos cerbos/cerbos --version=0.23.1 --values=demo-app/cerbos-values.yaml
```

## Submit Job
```
argo submit -n argo --watch https://raw.githubusercontent.com/cerbos/cerbos-argo-workflow/main/ci.yaml -p branch=main -p repoPath=/cerbos -p repo=https://github.com/cerbos/cerbos-argo-workflow.git
```

Port forward into the cluster to see the UI
```
kubectl -n argo port-forward deployment/argo-server 2746:2746
```