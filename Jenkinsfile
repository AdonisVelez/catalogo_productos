pipeline {
    agent any

    tools {
        nodejs "Node24" // Asegúrate de tener esta instalación en Jenkins
        dockerTool 'Dockertool' // Configura esta herramienta en Jenkins
    }

    stages {
        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Ejecutar tests') {
            steps {
                sh 'chmod +x node_modules/.bin/jest'
                sh 'npm test'
            }
        }

        stage('Construir Imagen Docker') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh 'docker build -t tienda-online:latest .'
            }
        }

        stage('Ejecutar Contenedor') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh '''
                    docker stop tienda-online || true
                    docker rm tienda-online || true

                    docker run -d --name tienda-online -p 3010:3000 tienda-online:latest
                '''
            }
        }
    }
}
