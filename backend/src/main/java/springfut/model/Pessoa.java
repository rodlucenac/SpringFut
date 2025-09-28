package springfut.model;

public class Pessoa {
    private int idPessoa;
    private String nome;
    private String telefoneDDD;
    private String telefoneNumero;
    private String email;
    private String senha;

    // Getters e Setters
    public int getIdPessoa() { return idPessoa; }
    public void setIdPessoa(int idPessoa) { this.idPessoa = idPessoa; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTelefoneDDD() { return telefoneDDD; }
    public void setTelefoneDDD(String telefoneDDD) { this.telefoneDDD = telefoneDDD; }

    public String getTelefoneNumero() { return telefoneNumero; }
    public void setTelefoneNumero(String telefoneNumero) { this.telefoneNumero = telefoneNumero; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}