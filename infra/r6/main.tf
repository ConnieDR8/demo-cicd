terraform {
  required_version = ">= 1.16.0, < 2.0.0"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "3.4.0"
    }
  }
}

provider "kubernetes" {
  config_path    = pathexpand("~/.kube/config")
  config_context = "rancher-desktop"
}

locals {
  namespace = "demo-iac-r6"
  app_name  = "r6-web"
}

resource "kubernetes_namespace_v1" "r6" {
  metadata {
    name = local.namespace

    labels = {
      proyecto     = "demo-cicd"
      administrado = "terraform"
    }
  }
}

resource "kubernetes_config_map_v1" "web" {
  metadata {
    name      = "r6-web-content"
    namespace = kubernetes_namespace_v1.r6.metadata[0].name
  }

  data = {
    "index.html" = file("${path.module}/index.html")
  }
}

resource "kubernetes_deployment_v1" "web" {
  metadata {
    name      = local.app_name
    namespace = kubernetes_namespace_v1.r6.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = local.app_name
      }
    }

    template {
      metadata {
        labels = {
          app = local.app_name
        }

        annotations = {
          "checksum/contenido" = filesha256("${path.module}/index.html")
        }
      }

      spec {
        container {
          name  = "nginx"
          image = "nginxinc/nginx-unprivileged:1.29-alpine"

          port {
            container_port = 8080
          }

          resources {
            requests = {
              cpu    = "20m"
              memory = "32Mi"
            }

            limits = {
              memory = "96Mi"
            }
          }

          readiness_probe {
            http_get {
              path = "/"
              port = 8080
            }

            initial_delay_seconds = 3
            period_seconds        = 5
          }

          volume_mount {
            name       = "contenido"
            mount_path = "/usr/share/nginx/html"
            read_only  = true
          }
        }

        volume {
          name = "contenido"

          config_map {
            name = kubernetes_config_map_v1.web.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "web" {
  metadata {
    name      = local.app_name
    namespace = kubernetes_namespace_v1.r6.metadata[0].name
  }

  spec {
    selector = {
      app = local.app_name
    }

    port {
      port        = 80
      target_port = 8080
    }

    type = "ClusterIP"
  }
}

output "namespace" {
  value = kubernetes_namespace_v1.r6.metadata[0].name
}

output "servicio" {
  value = kubernetes_service_v1.web.metadata[0].name
}
