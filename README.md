# Cerbos with Argo Workflow

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

Port forward into the cluster
```
kubectl -n argo port-forward deployment/argo-server 2746:2746
```

## Install the CLI
See https://github.com/argoproj/argo-workflows/releases/latest
```
curl -sLO https://github.com/argoproj/argo-workflows/releases/download/v3.4.4/argo-darwin-amd64.gz
gunzip argo-darwin-amd64.gz
chmod +x argo-darwin-amd64
mv ./argo-darwin-amd64 /usr/local/bin/argo
argo version
```

## Submit Job
```
argo submit -n argo --watch https://raw.githubusercontent.com/cerbos/cerbos-argo-workflow/main/ci.yaml


argo submit -n argo --watch ci.yaml -p branch=main -p repoPath=/cerbos -p repo=https://github.com/cerbos/cerbos-argo-workflow.git
```